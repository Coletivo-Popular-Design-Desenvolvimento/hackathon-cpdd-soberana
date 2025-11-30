#!/bin/bash

# VidChain - Script para Parar Serviços

echo "🛑 VidChain - Parando Serviços"
echo "================================"
echo ""

# Cores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

# Parar processos do backend (Gradle bootRun)
echo "☕ Parando Backend..."
BACKEND_PIDS=$(pgrep -f "gradlew.*bootRun" || true)
if [ -n "$BACKEND_PIDS" ]; then
    echo "$BACKEND_PIDS" | xargs kill 2>/dev/null || true
    echo -e "${GREEN}✅ Backend parado${NC}"
else
    echo -e "${YELLOW}⚠️  Backend não estava rodando${NC}"
fi

# Parar processos do frontend (Next.js)
echo "⚛️  Parando Frontend..."
FRONTEND_PIDS=$(pgrep -f "next dev" || true)
if [ -n "$FRONTEND_PIDS" ]; then
    echo "$FRONTEND_PIDS" | xargs kill 2>/dev/null || true
    echo -e "${GREEN}✅ Frontend parado${NC}"
else
    echo -e "${YELLOW}⚠️  Frontend não estava rodando${NC}"
fi

# Parar IPFS (Docker)
echo "🐳 Parando IPFS..."
if command -v docker >/dev/null 2>&1; then
    if docker ps | grep -q vidchain-ipfs; then
        docker-compose down 2>/dev/null || docker stop vidchain-ipfs 2>/dev/null || true
        echo -e "${GREEN}✅ IPFS parado${NC}"
    else
        echo -e "${YELLOW}⚠️  IPFS não estava rodando${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  Docker não encontrado${NC}"
fi

# Parar Hardhat node se estiver rodando
echo "⛓️  Verificando Hardhat node..."
HARDHAT_PIDS=$(pgrep -f "hardhat node" || true)
if [ -n "$HARDHAT_PIDS" ]; then
    echo "$HARDHAT_PIDS" | xargs kill 2>/dev/null || true
    echo -e "${GREEN}✅ Hardhat node parado${NC}"
else
    echo -e "${YELLOW}⚠️  Hardhat node não estava rodando${NC}"
fi

echo ""
echo "================================"
echo -e "${GREEN}✅ Todos os serviços foram parados${NC}"
echo ""

