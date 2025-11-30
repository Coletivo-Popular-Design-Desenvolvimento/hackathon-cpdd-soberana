# VidChain - Rede de Vídeos Curtos P2P

## Descrição do Projeto

O **VidChain** é um protótipo de rede social de vídeos curtos (no espírito de TikTok/Instagram Reels), construída com arquitetura distribuída e cooperação entre usuários. Em vez de armazenar tudo em servidores centralizados de Big Techs, os vídeos são:

- **armazenados e distribuídos via IPFS**, uma rede P2P descentralizada;
- **referenciados por CIDs (hashes de conteúdo)**, garantindo integridade e imutabilidade;
- **registrados em contratos inteligentes** na blockchain, criando um registro público e verificável de publicação.

O objetivo político-tecnológico é demonstrar, na prática, como podemos construir infraestruturas de comunicação que:

- não dependam de Google, Meta, Amazon, etc.;
- valorizem cooperação dos usuários (modelo "tipo torrent");
- aumentem a soberania digital de coletivos, movimentos e territórios.

## Tecnologias Utilizadas

### Backend
- **Java 17+** com **Spring Boot**
- **Gradle**

### Frontend
- **Next.js / React**

### Armazenamento Distribuído
- **IPFS (InterPlanetary File System)** - protocolo P2P livre para armazenamento distribuído

### Blockchain
- **Hardhat** - ambiente de desenvolvimento para contratos inteligentes
- **Solidity** - linguagem para contratos na EVM
- **Web3j** - biblioteca Java para interação com blockchain

