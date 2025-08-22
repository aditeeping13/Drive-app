package com.genie.Drive_BE.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;


@Entity
@Table(name = "files")
public class FileEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String path;
    private Long size;
    private String type;
    private Long parentFolderId;
    private LocalDateTime createdAt;

    public FileEntity() {
    }

    public FileEntity(Long id, String name, String path, Long size, String type, Long parentFolderId, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.path = path;
        this.size = size;
        this.type = type;
        this.parentFolderId = parentFolderId;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }

    public Long getSize() {
        return size;
    }

    public void setSize(Long size) {
        this.size = size;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Long getParentFolderId() {
        return parentFolderId;
    }

    public void setParentFolderId(Long parentFolderId) {
        this.parentFolderId = parentFolderId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
