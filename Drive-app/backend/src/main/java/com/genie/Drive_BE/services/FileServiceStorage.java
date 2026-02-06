package com.genie.Drive_BE.services;


import com.genie.Drive_BE.entity.FileEntity;
import com.genie.Drive_BE.repo.FileRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class FileServiceStorage {

    @Value("${file.upload-dir}")
    private String uploadDir;

    private final FileRepository fileRepository;

    public FileServiceStorage(FileRepository fileRepository) {
        this.fileRepository = fileRepository;
    }


    public String saveFile(MultipartFile file, String parentFolderId) throws IOException {
        Path uploadPath = Paths.get(uploadDir);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }
        String fileName = file.getOriginalFilename();
        Path filePath = uploadPath.resolve(fileName);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        FileEntity fileEntity = new FileEntity();
        fileEntity.setName(fileName);
        fileEntity.setPath(filePath.toString());
        fileEntity.setSize(file.getSize());
        fileEntity.setType(getFileType(fileName));
        fileEntity.setParentFolderId(parentFolderId);
        fileEntity.setCreatedAt(LocalDateTime.now());
        fileEntity.setLastAccessedAt(LocalDateTime.now());
        fileEntity.setFolder(false);

        fileRepository.save(fileEntity);
        return "File uploaded Successfully!";
    }

    private String getFileType(String fileName) {
        String ext = fileName.contains(".") ? fileName.substring(fileName.lastIndexOf(".") + 1).toLowerCase() : "unknown";
        if (List.of("jpg", "jpeg", "png", "gif").contains(ext)) return "image";
        if (List.of("mp4", "mov", "avi").contains(ext)) return "video";
        if (List.of("pdf", "doc", "docx", "txt").contains(ext)) return "document";
        return "other";
    }

    public void createFolder(String name, String parentFolderId) {
        FileEntity folder = new FileEntity();
        folder.setName(name);
        folder.setFolder(true);
        folder.setType("folder");
        folder.setParentFolderId(parentFolderId);
        folder.setCreatedAt(LocalDateTime.now());
        folder.setLastAccessedAt(LocalDateTime.now());
        fileRepository.save(folder);
    }

    public List<FileEntity> getFilesInFolder(String parentFolderId) {
        return fileRepository.findByParentFolderIdAndIsTrash(parentFolderId, false);
    }

    public List<FileEntity> getTrashFiles() {
        return fileRepository.findByIsTrash(true);
    }

    public List<FileEntity> getStarredFiles() {
        return fileRepository.findByIsStarredAndIsTrash(true, false);
    }

    public List<FileEntity> getRecentFiles() {
        return fileRepository.findByIsTrash(false).stream()
                .sorted((f1, f2) -> f2.getLastAccessedAt().compareTo(f1.getLastAccessedAt()))
                .limit(10)
                .collect(Collectors.toList());
    }

    public Map<String, Object> getStorageStats() {
        List<FileEntity> allFiles = fileRepository.findByIsTrash(false);
        long totalSize = allFiles.stream().mapToLong(f -> f.getSize() != null ? f.getSize() : 0).sum();
        
        Map<String, Long> breakdown = allFiles.stream()
                .filter(f -> !f.isFolder())
                .collect(Collectors.groupingBy(FileEntity::getType, Collectors.summingLong(f -> f.getSize() != null ? f.getSize() : 0)));

        List<FileEntity> largeFiles = allFiles.stream()
                .filter(f -> !f.isFolder())
                .sorted((f1, f2) -> Long.compare(f2.getSize(), f1.getSize()))
                .limit(5)
                .collect(Collectors.toList());

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalSize", totalSize);
        stats.put("breakdown", breakdown);
        stats.put("largeFiles", largeFiles);
        stats.put("limit", 15L * 1024 * 1024 * 1024); // 15GB dummy limit
        return stats;
    }

    public void purgeOldTrash() {
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        List<FileEntity> oldTrash = fileRepository.findByIsTrash(true).stream()
                .filter(f -> f.getLastAccessedAt().isBefore(thirtyDaysAgo))
                .collect(Collectors.toList());
        fileRepository.deleteAll(oldTrash);
    }

    public FileEntity getFileById(String id) {
        FileEntity file = fileRepository.findById(id).orElseThrow(() -> new RuntimeException("File not found"));
        file.setLastAccessedAt(LocalDateTime.now());
        fileRepository.save(file);
        return file;
    }

    public void moveToTrash(String id) {
        FileEntity file = getFileById(id);
        file.setTrash(true);
        file.setLastAccessedAt(LocalDateTime.now());
        fileRepository.save(file);
    }

    public void restoreFile(String id) {
        FileEntity file = getFileById(id);
        file.setTrash(false);
        fileRepository.save(file);
    }

    public void toggleStar(String id) {
        FileEntity file = getFileById(id);
        file.setStarred(!file.isStarred());
        fileRepository.save(file);
    }

    public void deleteById(String id) {
        fileRepository.deleteById(id);
    }
}
