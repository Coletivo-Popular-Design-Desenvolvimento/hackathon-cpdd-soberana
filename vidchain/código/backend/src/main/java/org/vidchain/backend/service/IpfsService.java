package org.vidchain.backend.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.client.MultipartBodyBuilder;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.BodyInserters;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.io.File;

/**
 * Serviço para integração com IPFS.
 * 
 * Requer IPFS rodando e acessível na URL configurada.
 * 
 * Para usar:
 * 1. Subir IPFS: docker compose up -d ipfs
 * 2. Configurar: ipfs.api-url e ipfs.gateway-url no application.properties
 */
@Service
public class IpfsService {

    private static final Logger logger = LoggerFactory.getLogger(IpfsService.class);
    
    private final WebClient webClient;
    private final String ipfsApiUrl;
    private final String ipfsGatewayUrl;

    public IpfsService(
            @Value("${ipfs.api-url:http://localhost:5001}") String ipfsApiUrl,
            @Value("${ipfs.gateway-url:http://localhost:9090}") String ipfsGatewayUrl) {
        this.ipfsApiUrl = ipfsApiUrl;
        this.ipfsGatewayUrl = ipfsGatewayUrl;
        this.webClient = WebClient.builder()
                .baseUrl(ipfsApiUrl)
                .build();
    }

    /**
     * Adiciona um arquivo ao IPFS.
     * 
     * @param file Arquivo a ser adicionado
     * @return CID do arquivo no IPFS
     * @throws RuntimeException se IPFS não estiver disponível
     */
    public String addFile(File file) {
        logger.info("Adicionando arquivo '{}' ao IPFS", file.getName());

        Resource resource = new FileSystemResource(file);
        
        MultipartBodyBuilder builder = new MultipartBodyBuilder();
        builder.part("file", resource)
               .contentType(MediaType.APPLICATION_OCTET_STREAM);

        // POST http://localhost:5001/api/v0/add
        String response = webClient.post()
                .uri("/api/v0/add")
                .contentType(MediaType.MULTIPART_FORM_DATA)
                .body(BodyInserters.fromMultipartData(builder.build()))
                .retrieve()
                .bodyToMono(String.class)
                .block();

        // Parse da resposta JSON do IPFS
        // Formato: {"Name":"...","Hash":"Qm...","Size":"..."}
        String cid = extractHashFromResponse(response);
        
        logger.info("Arquivo adicionado ao IPFS com CID: {}", cid);
        return cid;
    }

    /**
     * Extrai o Hash (CID) da resposta JSON do IPFS.
     */
    private String extractHashFromResponse(String response) {
        if (response == null || response.isEmpty()) {
            throw new RuntimeException("Resposta vazia do IPFS");
        }
        
        // Parse simples do JSON: buscar campo "Hash"
        // Formato: {"Name":"file.mp4","Hash":"QmABC123...","Size":"1234"}
        int hashIndex = response.indexOf("\"Hash\":\"");
        if (hashIndex == -1) {
            throw new RuntimeException("Hash não encontrado na resposta do IPFS: " + response);
        }
        
        int start = hashIndex + 8; // Tamanho de "Hash":"
        int end = response.indexOf("\"", start);
        if (end == -1) {
            throw new RuntimeException("Formato de resposta inválido do IPFS");
        }
        
        return response.substring(start, end);
    }

    /**
     * Gera URL do gateway IPFS para um CID.
     * 
     * @param cid CID do conteúdo
     * @return URL do gateway
     */
    public String getIpfsUrl(String cid) {
        return ipfsGatewayUrl + "/ipfs/" + cid;
    }
}
