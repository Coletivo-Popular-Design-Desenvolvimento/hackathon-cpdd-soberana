package org.vidchain.backend.controller;

import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.vidchain.backend.dto.VideoResponse;
import org.vidchain.backend.model.Video;
import org.vidchain.backend.service.VideoService;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/videos")
public class VideoController {

    private final VideoService videoService;

    public VideoController(VideoService videoService) {
        this.videoService = videoService;
    }

    @PostMapping("/upload")
    public ResponseEntity<VideoResponse> uploadVideo(
            @RequestParam("file") MultipartFile file,
            @RequestParam("title") String title) {
        try {
            // Por enquanto, autor fixo (futuramente virá de autenticação)
            String author = "demo-user";
            
            Video video = videoService.uploadVideo(file, title, author);
            
            VideoResponse response = new VideoResponse(
                    video.getId(),
                    video.getTitle(),
                    video.getFakeCid(),
                    "/videos/file/" + video.getId(),
                    video.getAuthor(),
                    video.getCreatedAt()
            );
            
            return ResponseEntity.ok(response);
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/feed")
    public ResponseEntity<List<VideoResponse>> getFeed() {
        List<Video> videos = videoService.getFeed();
        
        List<VideoResponse> responses = videos.stream()
                .map(video -> new VideoResponse(
                        video.getId(),
                        video.getTitle(),
                        video.getFakeCid(),
                        "/videos/file/" + video.getId(),
                        video.getAuthor(),
                        video.getCreatedAt()
                ))
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/file/{id}")
    public ResponseEntity<Resource> getVideoFile(@PathVariable UUID id) {
        Video video = videoService.findById(id);
        if (video == null) {
            return ResponseEntity.notFound().build();
        }
        
        File file = videoService.getVideoFile(video.getFileName());
        if (!file.exists()) {
            return ResponseEntity.notFound().build();
        }
        
        Resource resource = new FileSystemResource(file);
        
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + video.getTitle() + "\"")
                .contentType(MediaType.parseMediaType("video/mp4"))
                .body(resource);
    }
}
