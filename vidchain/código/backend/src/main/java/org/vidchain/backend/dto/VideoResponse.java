package org.vidchain.backend.dto;

import java.time.Instant;
import java.util.UUID;

public class VideoResponse {
    private UUID id;
    private String title;
    private String fakeCid;
    private String localUrl;
    private String author;
    private Instant createdAt;

    public VideoResponse() {
    }

    public VideoResponse(UUID id, String title, String fakeCid, String localUrl, String author, Instant createdAt) {
        this.id = id;
        this.title = title;
        this.fakeCid = fakeCid;
        this.localUrl = localUrl;
        this.author = author;
        this.createdAt = createdAt;
    }

    // Getters and Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getFakeCid() {
        return fakeCid;
    }

    public void setFakeCid(String fakeCid) {
        this.fakeCid = fakeCid;
    }

    public String getLocalUrl() {
        return localUrl;
    }

    public void setLocalUrl(String localUrl) {
        this.localUrl = localUrl;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}

