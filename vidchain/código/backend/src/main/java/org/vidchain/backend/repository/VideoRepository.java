package org.vidchain.backend.repository;

import org.springframework.stereotype.Repository;
import org.vidchain.backend.model.Video;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

@Repository
public class VideoRepository {

    // Armazenamento em memória
    private final Map<UUID, Video> videos = new ConcurrentHashMap<>();

    public Video save(Video video) {
        videos.put(video.getId(), video);
        return video;
    }

    public List<Video> findAll() {
        return videos.values().stream()
                .sorted((v1, v2) -> v2.getCreatedAt().compareTo(v1.getCreatedAt()))
                .collect(Collectors.toList());
    }

    public Video findById(UUID id) {
        return videos.get(id);
    }
}

