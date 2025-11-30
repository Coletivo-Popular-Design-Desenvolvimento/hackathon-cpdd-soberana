#!/bin/bash

# VidChain - Script de Inicialização
# Inicia IPFS (Docker), Backend e Frontend

set -e

echo "🚀 VidChain - Iniciando Serviços"
echo "================================"
echo ""

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

# Verificar se Docker está rodando
if command -v docker >/dev/null 2>&1; then
    if docker info >/dev/null 2>&1; then
        echo -e "${BLUE}🐳 Iniciando IPFS (Docker)...${NC}"
        docker compose up -d ipfs
        echo -e "${GREEN}✅ IPFS iniciado${NC}"
        echo "   API: http://localhost:5001"
        echo "   Gateway: http://localhost:9090"
        echo ""
    else
        echo -e "${YELLOW}⚠️  Docker não está rodando. IPFS não será iniciado.${NC}"
        echo ""
    fi
else
    echo -e "${YELLOW}⚠️  Docker não encontrado. IPFS não será iniciado.${NC}"
    echo ""
fi

# Iniciar Hardhat node (se contratos estiverem configurados)
if [ -f "código/contracts/package.json" ]; then
    echo -e "${BLUE}⛓️  Iniciando Hardhat node (Blockchain)...${NC}"
    cd código/contracts
    
    # Verificar se node_modules existe, se não, instalar
    if [ ! -d "node_modules" ]; then
        echo "   Instalando dependências do Hardhat..."
        npm install > /dev/null 2>&1
    fi
    
    # Verificar se contratos foram compilados
    if [ ! -d "artifacts" ]; then
        echo "   Compilando contratos..."
        npm run compile > /dev/null 2>&1
    fi
    
    # Iniciar Hardhat node em background
    npm run node > /tmp/vidchain-hardhat.log 2>&1 &
    HARDHAT_PID=$!
    cd ../..
    
    # Aguardar Hardhat iniciar
    echo "   Aguardando Hardhat node iniciar..."
    sleep 5
    
    # Verificar se Hardhat está respondendo
    if curl -s -X POST -H "Content-Type: application/json" --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' http://localhost:8545 > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Hardhat node rodando em http://localhost:8545${NC}"
        
        # Fazer deploy do contrato se ainda não foi feito
        if ! grep -q "blockchain.contract.address" código/backend/src/main/resources/application.properties 2>/dev/null || grep -q "blockchain.contract.address=$" código/backend/src/main/resources/application.properties 2>/dev/null; then
            echo "   Fazendo deploy do contrato..."
            cd código/contracts
            DEPLOY_OUTPUT=$(npm run deploy 2>&1)
            CONTRACT_ADDRESS=$(echo "$DEPLOY_OUTPUT" | grep -o "0x[a-fA-F0-9]\{40\}" | head -1)
            if [ -n "$CONTRACT_ADDRESS" ]; then
                echo -e "${GREEN}✅ Contrato deployado: ${CONTRACT_ADDRESS}${NC}"
                echo "   (Configure este endereço em application.properties se necessário)"
            fi
            cd ../..
        fi
    else
        echo -e "${YELLOW}⚠️  Hardhat node pode estar ainda iniciando...${NC}"
    fi
    echo ""
else
    echo -e "${YELLOW}⚠️  Diretório de contratos não encontrado. Hardhat não será iniciado.${NC}"
    echo ""
fi

# Função para limpar processos ao sair
cleanup() {
    echo ""
    echo -e "${YELLOW}🛑 Parando serviços...${NC}"
    kill $BACKEND_PID $FRONTEND_PID $HARDHAT_PID 2>/dev/null || true
    exit
}

trap cleanup SIGINT SIGTERM

# Iniciar Backend
echo -e "${BLUE}☕ Iniciando Backend (Spring Boot)...${NC}"
cd código/backend
chmod +x gradlew
./gradlew bootRun > /tmp/vidchain-backend.log 2>&1 &
BACKEND_PID=$!
cd ../..

# Aguardar backend iniciar
echo "   Aguardando backend iniciar..."
sleep 8

# Verificar se backend está rodando
if curl -s http://localhost:8080/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend rodando em http://localhost:8080${NC}"
else
    echo -e "${YELLOW}⚠️  Backend pode estar ainda iniciando...${NC}"
fi
echo ""

# Iniciar Frontend
echo -e "${BLUE}⚛️  Iniciando Frontend (Next.js)...${NC}"
cd código/frontend
npm run dev > /tmp/vidchain-frontend.log 2>&1 &
FRONTEND_PID=$!
cd ../..

# Aguardar frontend iniciar
echo "   Aguardando frontend iniciar..."
sleep 5

echo -e "${GREEN}✅ Frontend rodando em http://localhost:3000${NC}"
echo ""

echo "================================"
echo -e "${GREEN}✅ Todos os serviços iniciados!${NC}"
echo ""
echo "📍 URLs:"
echo "   • Frontend: http://localhost:3000"
echo "   • Backend:  http://localhost:8080"
echo "   • Health:   http://localhost:8080/health"
if command -v docker >/dev/null 2>&1 && docker ps | grep -q vidchain-ipfs; then
    echo "   • IPFS API: http://localhost:5001"
    echo "   • IPFS Gateway: http://localhost:9090"
fi
if pgrep -f "hardhat node" > /dev/null; then
    echo "   • Hardhat RPC: http://localhost:8545"
fi
echo ""
echo "📝 Logs:"
echo "   • Backend:  tail -f /tmp/vidchain-backend.log"
echo "   • Frontend: tail -f /tmp/vidchain-frontend.log"
if [ -n "$HARDHAT_PID" ]; then
    echo "   • Hardhat:  tail -f /tmp/vidchain-hardhat.log"
fi
echo ""
echo "🛑 Para parar: Pressione Ctrl+C ou execute ./stop.sh"
echo ""

# Manter script rodando
wait

