package org.vidchain.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.vidchain.backend.contracts.ContentRegistry;
import org.web3j.crypto.Credentials;
import org.web3j.protocol.Web3j;
import org.web3j.protocol.http.HttpService;
import org.web3j.tx.gas.DefaultGasProvider;

@Configuration
public class Web3Config {

    @Value("${blockchain.rpc-url:http://localhost:8545}")
    private String rpcUrl;

    @Value("${blockchain.private-key:}")
    private String privateKey;

    @Value("${blockchain.contract.address:}")
    private String contractAddress;

    @Bean
    public Web3j web3j() {
        return Web3j.build(new HttpService(rpcUrl));
    }

    @Bean
    public Credentials credentials() {
        if (privateKey == null || privateKey.isEmpty()) {
            // Usar chave padrão do Hardhat (conta #0)
            privateKey = "ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";
        }
        return Credentials.create(privateKey);
    }

    @Bean
    public ContentRegistry contentRegistry(Web3j web3j, Credentials credentials) {
        if (contractAddress == null || contractAddress.isEmpty()) {
            throw new IllegalStateException("blockchain.contract.address não configurado no application.properties");
        }
        return ContentRegistry.load(contractAddress, web3j, credentials, new DefaultGasProvider());
    }
}

