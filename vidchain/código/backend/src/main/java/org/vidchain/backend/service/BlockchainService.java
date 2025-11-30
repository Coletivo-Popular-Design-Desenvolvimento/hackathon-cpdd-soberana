package org.vidchain.backend.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.vidchain.backend.contracts.ContentRegistry;
import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.core.methods.response.TransactionReceipt;


/**
 * Serviço para integração com blockchain.
 * 
 * Requer Hardhat node rodando e contrato deployado.
 * 
 * Para usar:
 * 1. Subir Hardhat node: cd código/contracts && npm run node
 * 2. Fazer deploy: npm run deploy
 * 3. Configurar: blockchain.contract.address no application.properties
 */
@Service
public class BlockchainService {

    private static final Logger logger = LoggerFactory.getLogger(BlockchainService.class);
    
    private final Web3j web3j;
    private final Credentials credentials;
    private final ContentRegistry contract;

    public BlockchainService(
            Web3j web3j,
            Credentials credentials,
            @Autowired(required = false) ContentRegistry contract) {
        this.web3j = web3j;
        this.credentials = credentials;
        this.contract = contract;
        
        if (contract == null) {
            logger.error("ContentRegistry contract não está configurado! Configure blockchain.contract.address no application.properties");
            throw new IllegalStateException("Blockchain contract não configurado. Configure blockchain.contract.address no application.properties");
        }
    }

    /**
     * Publica um vídeo na blockchain.
     * 
     * @param cid CID do vídeo no IPFS
     * @throws Exception se não conseguir publicar na blockchain
     */
    public void publishVideo(String cid) throws Exception {
        logger.info("Publicando vídeo na blockchain com CID: {}", cid);
        
        TransactionReceipt receipt = contract.publishVideo(cid).send();
        logger.info("Transação confirmada: {}", receipt.getTransactionHash());
        logger.info("Block number: {}", receipt.getBlockNumber());
    }

    /**
     * Verifica se um CID foi publicado na blockchain.
     * 
     * @param cid CID a verificar
     * @return true se foi publicado
     */
    public boolean isPublished(String cid) {
        try {
            return contract.isPublished(cid).send();
        } catch (Exception e) {
            logger.error("Erro ao verificar se CID foi publicado", e);
            return false;
        }
    }
}
