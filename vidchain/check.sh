#!/bin/bash

# VidChain - Script de Verificação
# Verifica se todos os serviços estão rodando corretamente

echo "🔍 VidChain - Verificação de Status"
echo "================================"
echo ""

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

ALL_OK=1

# Verificar Backend
echo -e "${BLUE}☕ Verificando Backend...${NC}"
if curl -s http://localhost:8080/health > /dev/null 2>&1; then
    HEALTH=$(curl -s http://localhost:8080/health)
    echo -e "${GREEN}✅ Backend rodando em http://localhost:8080${NC}"
    echo "   Resposta: $HEALTH"
else
    echo -e "${RED}❌ Backend não está respondendo${NC}"
    echo "   Execute: cd código/backend && ./gradlew bootRun"
    ALL_OK=0
fi
echo ""

# Verificar Frontend
echo -e "${BLUE}⚛️  Verificando Frontend...${NC}"
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Frontend rodando em http://localhost:3000${NC}"
else
    echo -e "${RED}❌ Frontend não está respondendo${NC}"
    echo "   Execute: cd código/frontend && npm run dev"
    ALL_OK=0
fi
echo ""

# Verificar IPFS
echo -e "${BLUE}🐳 Verificando IPFS...${NC}"
if command -v docker >/dev/null 2>&1; then
    if docker ps | grep -q vidchain-ipfs; then
        if curl -s http://localhost:5001/api/v0/version > /dev/null 2>&1; then
            IPFS_VERSION=$(curl -s http://localhost:5001/api/v0/version | grep -o '"Version":"[^"]*' | cut -d'"' -f4 || echo "desconhecida")
            echo -e "${GREEN}✅ IPFS rodando${NC}"
            echo "   API: http://localhost:5001"
            echo "   Gateway: http://localhost:9090"
            echo "   Versão: $IPFS_VERSION"
        else
            echo -e "${YELLOW}⚠️  Container IPFS existe mas não está respondendo${NC}"
        fi
    else
        echo -e "${YELLOW}⚠️  IPFS não está rodando${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Docker não encontrado (IPFS opcional)${NC}"
fi
echo ""

# Verificar Hardhat
echo -e "${BLUE}⛓️  Verificando Hardhat node...${NC}"
if pgrep -f "hardhat node" > /dev/null; then
    if curl -s -X POST -H "Content-Type: application/json" --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' http://localhost:8545 > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Hardhat node rodando em http://localhost:8545${NC}"
    else
        echo -e "${YELLOW}⚠️  Processo Hardhat existe mas não está respondendo${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Hardhat node não está rodando${NC}"
fi
echo ""

# Resumo
echo "================================"
if [ $ALL_OK -eq 1 ]; then
    echo -e "${GREEN}✅ Todos os serviços essenciais estão rodando!${NC}"
    echo ""
    echo "📍 Acesse: http://localhost:3000"
else
    echo -e "${RED}❌ Alguns serviços não estão rodando${NC}"
    echo ""
    echo "💡 Dica: Execute ./start.sh para iniciar todos os serviços"
fi
echo ""

