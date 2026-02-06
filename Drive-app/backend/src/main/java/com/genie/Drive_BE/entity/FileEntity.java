package com.genie.Drive_BE.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;


@Document(collection = "files")
public class FileEntity {

    @Id
    private String id;

    private String name;
    private String path;
    private Long size;
    private String type;
    private String parentFolderId;
    private LocalDateTime createdAt;

    private boolean isTrash = false;
    private boolean isStarred = false;
    private boolean isFolder = false;
    private String category = "my-drive";
    private String owner = "Me";
    private String owner = "Me";
    private LocalDateTime lastAccessedAt;

    public FileEntity() {
    }

    public FileEntity(String id, String name, String path, Long size, String type, String parentFolderId, LocalDateTime createdAt, boolean isTrash, boolean isStarred, boolean isFolder, String category, String owner, LocalDateTime lastAccessedAt) {
        this.id = id;
        this.name = name;
        this.path = path;
        this.size = size;
        this.type = type;
        this.parentFolderId = parentFolderId;
        this.createdAt = createdAt;
        this.isTrash = isTrash;
        this.isStarred = isStarred;
        this.isFolder = isFolder;
        this.category = category;
        this.owner = owner;
        this.lastAccessedAt = lastAccessedAt;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
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

    public String getParentFolderId() {
        return parentFolderId;
    }

    public void setParentFolderId(String parentFolderId) {
        this.parentFolderId = parentFolderId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public boolean isTrash() {
        return isTrash;
    }

    public void setTrash(boolean trash) {
        isTrash = trash;
    }

    public boolean isStarred() {
        return isStarred;
    }

    public void setStarred(boolean starred) {
        isStarred = starred;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public LocalDateTime getLastAccessedAt() {
        return lastAccessedAt;
    }

    public void setLastAccessedAt(LocalDateTime lastAccessedAt) {
        this.lastAccessedAt = lastAccessedAt;
    }

    public boolean isFolder() {
        return isFolder;
    }

    public void setFolder(boolean folder) {
        isFolder = folder;
    }

    public String getOwner() {
        return owner;
    }

    public void setOwner(String owner) {
        this.owner = owner;
    }
}
