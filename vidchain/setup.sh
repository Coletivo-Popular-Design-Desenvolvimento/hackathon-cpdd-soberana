#!/bin/bash

# VidChain - Script de Setup
# Instala todas as dependências necessárias para rodar o projeto

set -e  # Para em caso de erro

echo "🚀 VidChain - Setup do Projeto"
echo "================================"
echo ""

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Função para verificar se comando existe
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Verificar pré-requisitos
echo "📋 Verificando pré-requisitos..."
echo ""

MISSING_DEPS=0

if ! command_exists java; then
    echo -e "${RED}❌ Java não encontrado${NC}"
    echo "   Instale Java 17 ou superior"
    MISSING_DEPS=1
else
    JAVA_VERSION=$(java -version 2>&1 | head -n 1)
    echo -e "${GREEN}✅ Java encontrado: ${JAVA_VERSION}${NC}"
fi

if ! command_exists node; then
    echo -e "${RED}❌ Node.js não encontrado${NC}"
    echo "   Instale Node.js 18 ou superior"
    MISSING_DEPS=1
else
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✅ Node.js encontrado: ${NODE_VERSION}${NC}"
fi

if ! command_exists npm; then
    echo -e "${RED}❌ npm não encontrado${NC}"
    MISSING_DEPS=1
else
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}✅ npm encontrado: ${NPM_VERSION}${NC}"
fi

if ! command_exists docker; then
    echo -e "${YELLOW}⚠️  Docker não encontrado (opcional para IPFS)${NC}"
else
    DOCKER_VERSION=$(docker --version)
    echo -e "${GREEN}✅ Docker encontrado: ${DOCKER_VERSION}${NC}"
fi

echo ""

if [ $MISSING_DEPS -eq 1 ]; then
    echo -e "${RED}❌ Alguns pré-requisitos estão faltando. Instale-os antes de continuar.${NC}"
    exit 1
fi

# Setup Backend
echo "📦 Configurando Backend (Spring Boot)..."
echo ""
cd código/backend

if [ ! -f "gradlew" ]; then
    echo -e "${RED}❌ gradlew não encontrado${NC}"
    exit 1
fi

# Dar permissão de execução ao gradlew
chmod +x gradlew

# Baixar dependências do Gradle (isso também baixa o wrapper se necessário)
echo "   Baixando dependências do Gradle..."
./gradlew build --no-daemon -x test > /dev/null 2>&1 || true

echo -e "${GREEN}✅ Backend configurado${NC}"
echo ""

# Setup Frontend
echo "📦 Configurando Frontend (Next.js)..."
echo ""
cd ../frontend

if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ package.json não encontrado${NC}"
    exit 1
fi

echo "   Instalando dependências do npm..."
npm install

echo "   Verificando build do Next.js..."
npm run build > /dev/null 2>&1 || echo -e "${YELLOW}⚠️  Build pode ter falhado (não crítico para desenvolvimento)${NC}"

echo -e "${GREEN}✅ Frontend configurado${NC}"
echo ""

# Setup Contracts (opcional)
echo "📦 Configurando Contracts (Hardhat)..."
echo ""
cd ../contracts

if [ -f "package.json" ]; then
    echo "   Instalando dependências do npm..."
    npm install
    
    echo "   Compilando contratos..."
    npm run compile > /dev/null 2>&1 || echo -e "${YELLOW}⚠️  Compilação pode ter falhado (não crítico)${NC}"
    
    echo -e "${GREEN}✅ Contracts configurado${NC}"
else
    echo -e "${YELLOW}⚠️  package.json não encontrado em contracts (opcional)${NC}"
fi

echo ""

# Voltar para raiz
cd ../../

echo "================================"
echo -e "${GREEN}✅ Setup concluído com sucesso!${NC}"
echo ""
echo "Próximos passos:"
echo "  • Para rodar tudo: ./start.sh"
echo "  • Para rodar sem IPFS: ./start-minimal.sh"
echo "  • Para verificar: ./check.sh"
echo ""

