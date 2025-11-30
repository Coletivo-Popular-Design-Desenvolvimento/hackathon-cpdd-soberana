package org.vidchain.backend.model;

import java.time.Instant;
import java.util.UUID;

public class Video {
    private UUID id;
    private String title;
    private String fakeCid;
    private String fileName;
    private String author;
    private Instant createdAt;

    public Video() {
    }

    public Video(String title, String fakeCid, String fileName, String author) {
        this.id = UUID.randomUUID();
        this.title = title;
        this.fakeCid = fakeCid;
        this.fileName = fileName;
        this.author = author;
        this.createdAt = Instant.now();
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

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
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

