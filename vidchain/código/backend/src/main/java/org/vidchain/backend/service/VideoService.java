package org.vidchain.backend.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.vidchain.backend.model.Video;
import org.vidchain.backend.repository.VideoRepository;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class VideoService {

    private final VideoRepository videoRepository;
    private final IpfsService ipfsService;
    private final BlockchainService blockchainService;
    private static final String UPLOAD_DIR = "/tmp/videos";

    public VideoService(
            VideoRepository videoRepository,
            IpfsService ipfsService,
            BlockchainService blockchainService) {
        this.videoRepository = videoRepository;
        this.ipfsService = ipfsService;
        this.blockchainService = blockchainService;
        // Criar diretório se não existir
        try {
            Files.createDirectories(Paths.get(UPLOAD_DIR));
        } catch (IOException e) {
            throw new RuntimeException("Não foi possível criar diretório de upload", e);
        }
    }

    public Video uploadVideo(MultipartFile file, String title, String author) throws IOException {
        String originalFileName = file.getOriginalFilename();
        String fileExtension = originalFileName != null && originalFileName.contains(".") 
            ? originalFileName.substring(originalFileName.lastIndexOf(".")) 
            : ".mp4";
        String savedFileName = UUID.randomUUID().toString() + fileExtension;
        
        Path filePath = Paths.get(UPLOAD_DIR, savedFileName);
        Files.write(filePath, file.getBytes());
        
        // 1. Adicionar ao IPFS
        File savedFile = filePath.toFile();
        String cid = ipfsService.addFile(savedFile);
        
        // 2. Publicar na blockchain
        try {
            blockchainService.publishVideo(cid);
        } catch (Exception e) {
            throw new IOException("Erro ao publicar vídeo na blockchain: " + e.getMessage(), e);
        }
        
        // 3. Criar entidade Video e salvar
        Video video = new Video(title, cid, savedFileName, author);
        videoRepository.save(video);
        
        return video;
    }

    public List<Video> getFeed() {
        return videoRepository.findAll();
    }

    public Video findById(UUID id) {
        return videoRepository.findById(id);
    }

    public File getVideoFile(String fileName) {
        Path filePath = Paths.get(UPLOAD_DIR, fileName);
        return filePath.toFile();
    }
}

