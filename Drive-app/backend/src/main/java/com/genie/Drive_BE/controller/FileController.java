package com.genie.Drive_BE.controller;

import com.genie.Drive_BE.entity.FileEntity;
import com.genie.Drive_BE.services.FileServiceStorage;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/files")
@CrossOrigin(origins = {
        "http://localhost:3000",
        "https://charming-pika-4292b1.netlify.app"
}, allowCredentials = "true")
public class FileController {


    private final FileServiceStorage fileServiceStorage;

    public FileController(FileServiceStorage fileServiceStorage) {
        this.fileServiceStorage = fileServiceStorage;
    }


    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(@RequestParam("file")MultipartFile file,
                                             @RequestParam(value = "parentFolderId",required = false) String parentFolderId)
    {
        try{
            String response=fileServiceStorage.saveFile(file,parentFolderId);
            return ResponseEntity.ok(response);
        }
        catch (Exception e)
        {
            return ResponseEntity.status(500).body("File upload failed!");
        }
    }

    @GetMapping("/download/{id}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String id)
    {
        try{
            //mysql meta data
            FileEntity fileEntity=fileServiceStorage.getFileById(id);
            Path path = Paths.get(fileEntity.getPath());
            Resource resource=new UrlResource(path.toUri());
            return ResponseEntity.ok()
                    .header("content-Disposition","attachment; filename=\""+fileEntity.getName() + "\"")
                    .body(resource);
        }
        catch (Exception e)
        {
            return ResponseEntity.status(404).build();
        }
    }


    @GetMapping("/list")
    public ResponseEntity<List<FileEntity>> listfiles(
            @RequestParam(value = "parentFolderId", required = false) String parentFolderId,
            @RequestParam(value = "category", required = false, defaultValue = "home") String category) {
        List<FileEntity> files;
        switch (category.toLowerCase()) {
            case "trash":
                files = fileServiceStorage.getTrashFiles();
                break;
            case "starred":
                files = fileServiceStorage.getStarredFiles();
                break;
            case "recent":
                files = fileServiceStorage.getRecentFiles();
                break;
            case "shared-with-me":
                // Simulate shared files by owner check
                files = fileServiceStorage.getRecentFiles().stream()
                        .filter(f -> !"Me".equals(f.getOwner()))
                        .collect(Collectors.toList());
                break;
            case "home":
                files = fileServiceStorage.getRecentFiles();
                break;
            case "my-drive":
            default:
                files = fileServiceStorage.getFilesInFolder(parentFolderId);
        }
        return ResponseEntity.ok(files);
    }

    @PostMapping("/create-folder")
    public ResponseEntity<String> createFolder(@RequestParam String name, @RequestParam(required = false) String parentFolderId) {
        fileServiceStorage.createFolder(name, parentFolderId);
        return ResponseEntity.ok("Folder created");
    }

    @GetMapping("/storage-stats")
    public ResponseEntity<Map<String, Object>> getStorageStats() {
        return ResponseEntity.ok(fileServiceStorage.getStorageStats());
    }

    @DeleteMapping("/purge-trash")
    public ResponseEntity<String> purgeTrash() {
        fileServiceStorage.purgeOldTrash();
        return ResponseEntity.ok("Old trash purged");
    }

    @PostMapping("/trash/{id}")
    public ResponseEntity<String> moveToTrash(@PathVariable String id) {
        try {
            fileServiceStorage.moveToTrash(id);
            return ResponseEntity.ok("File moved to trash");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to move file to trash");
        }
    }

    @PostMapping("/restore/{id}")
    public ResponseEntity<String> restoreFile(@PathVariable String id) {
        try {
            fileServiceStorage.restoreFile(id);
            return ResponseEntity.ok("File restored successfully");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to restore file");
        }
    }

    @PostMapping("/star/{id}")
    public ResponseEntity<String> toggleStar(@PathVariable String id) {
        try {
            fileServiceStorage.toggleStar(id);
            return ResponseEntity.ok("Star toggled successfully");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Failed to toggle star");
        }
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteFile(@PathVariable String id)
    {
        try {
            //will take path from mysql
            FileEntity fileEntity=fileServiceStorage.getFileById(id);

            //will make path and delete from disk
            Path path = Paths.get(fileEntity.getPath());
            Files.deleteIfExists(path);
            fileServiceStorage.deleteById(id);
            return ResponseEntity.ok("File deleted successfully");
        }
        catch (Exception e)
        {
            return ResponseEntity.status(500).body("Failed to delete file.");
        }
    }
}
