# Contracts - VidChain

Contratos inteligentes para registro de vídeos na blockchain.

## Contrato: ContentRegistry.sol

Registra CIDs de vídeos publicados no IPFS em um ledger imutável na blockchain.

### Funcionalidades

- `publishVideo(string cid)` - Publica um vídeo registrando seu CID
- `isPublished(string cid)` - Verifica se um CID foi publicado
- `getVideoInfo(string cid)` - Retorna informações de um vídeo
- `getTotalVideos()` - Retorna total de vídeos publicados

## Setup

### 1. Instalar dependências

```bash
npm install
```

### 2. Compilar contratos

```bash
npm run compile
```

### 3. Iniciar Hardhat node (devnet local)

```bash
npm run node
```

Isso iniciará um nó local na porta 8545.

### 4. Deploy do contrato

Em outro terminal:

```bash
npm run deploy
```

Isso fará o deploy e imprimirá o endereço do contrato. Copie esse endereço para:
`código/backend/src/main/resources/application.properties`:
```properties
blockchain.contract.address=0x...
blockchain.enabled=true
```

## Integração com Backend

Após fazer deploy:

1. Gerar wrapper Java do contrato (usando web3j CLI ou plugin)
2. Configurar endereço do contrato no `application.properties`
3. Habilitar blockchain: `blockchain.enabled=true`

## Notas

- Hardhat node fornece 10 contas de teste com fundos
- Primeira conta (índice 0) é usada por padrão
- Chain ID: 1337
- RPC URL: http://localhost:8545
