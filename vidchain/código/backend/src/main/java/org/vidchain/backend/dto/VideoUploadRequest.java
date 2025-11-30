package org.vidchain.backend.dto;

public class VideoUploadRequest {
    private String title;

    public VideoUploadRequest() {
    }

    public VideoUploadRequest(String title) {
        this.title = title;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }
}

