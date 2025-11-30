# VidChain

Rede de vídeos curtos P2P com IPFS + blockchain para soberania digital e cooperação popular.

## Estrutura do Projeto

```
vidchain/
├── conceito.md              # Descrição completa do projeto e requisitos
├── README.md                # Este arquivo
├── código/
│   ├── backend/             # Spring Boot (Java)
│   ├── frontend/            # Next.js/React
│   ├── contracts/           # Hardhat + Solidity
│   └── helper-node/         # Nó cooperador (planejado)
└── documentação/            # Documentação adicional
```

## Pré-requisitos

- Java 17 ou superior
- Node.js 18+ e npm/yarn
- (Opcional) Docker para IPFS e PostgreSQL

## Como Rodar

### 🚀 Forma Rápida (Recomendada)

Para facilitar a avaliação, criei scripts shell que automatizam tudo:

```bash
# 1. Primeira vez: instalar dependências
./setup.sh

# 2. Iniciar todos os serviços (Backend + Frontend + IPFS)
./start.sh

# 3. Verificar se tudo está rodando
./check.sh

# 4. Parar todos os serviços
./stop.sh
```

**Scripts disponíveis:**
- `setup.sh` - Instala todas as dependências (backend, frontend, contracts)
- `start.sh` - Inicia tudo: IPFS (Docker), Backend e Frontend
- `start-minimal.sh` - Inicia apenas Backend e Frontend (sem IPFS, usa modo mock)
- `stop.sh` - Para todos os serviços
- `check.sh` - Verifica status de todos os serviços

### 📝 Forma Manual

#### Backend

```bash
cd código/backend
./gradlew bootRun
```

O backend estará disponível em `http://localhost:8080`

Endpoint de teste: `GET /health` retorna `{"status": "ok"}`

#### Frontend

```bash
cd código/frontend
npm install
npm run dev
```

O frontend estará disponível em `http://localhost:3000`

#### IPFS

```bash
# Iniciar IPFS via Docker
docker-compose up -d ipfs

# Verificar se está rodando
curl http://localhost:5001/api/v0/version
```



