// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title ContentRegistry
 * @dev Contrato para registro de vídeos publicados no VidChain
 * Registra CIDs do IPFS e autor em um ledger imutável
 */
contract ContentRegistry {
    
    event VideoPublished(
        address indexed author,
        string cid,
        uint256 timestamp,
        uint256 indexed blockNumber
    );
    
    struct VideoRecord {
        address author;
        string cid;
        uint256 timestamp;
        uint256 blockNumber;
    }
    
    // Mapeamento de CID para registro
    mapping(string => VideoRecord) public videos;
    
    // Lista de todos os CIDs publicados
    string[] public allCids;
    
    /**
     * @dev Publica um vídeo registrando seu CID no IPFS
     * @param cid CID do vídeo no IPFS
     */
    function publishVideo(string calldata cid) external {
        require(bytes(cid).length > 0, "CID cannot be empty");
        
        // Verificar se já foi publicado
        require(videos[cid].timestamp == 0, "Video already published");
        
        VideoRecord memory record = VideoRecord({
            author: msg.sender,
            cid: cid,
            timestamp: block.timestamp,
            blockNumber: block.number
        });
        
        videos[cid] = record;
        allCids.push(cid);
        
        emit VideoPublished(
            msg.sender,
            cid,
            block.timestamp,
            block.number
        );
    }
    
    /**
     * @dev Verifica se um CID foi publicado
     * @param cid CID a verificar
     * @return true se foi publicado
     */
    function isPublished(string calldata cid) external view returns (bool) {
        return videos[cid].timestamp > 0;
    }
    
    /**
     * @dev Retorna informações de um vídeo publicado
     * @param cid CID do vídeo
     * @return author Endereço do autor
     * @return timestamp Timestamp de publicação
     * @return blockNumber Número do bloco
     */
    function getVideoInfo(string calldata cid) external view returns (
        address author,
        uint256 timestamp,
        uint256 blockNumber
    ) {
        VideoRecord memory record = videos[cid];
        require(record.timestamp > 0, "Video not found");
        return (record.author, record.timestamp, record.blockNumber);
    }
    
    /**
     * @dev Retorna o total de vídeos publicados
     * @return Total de CIDs
     */
    function getTotalVideos() external view returns (uint256) {
        return allCids.length;
    }
}

