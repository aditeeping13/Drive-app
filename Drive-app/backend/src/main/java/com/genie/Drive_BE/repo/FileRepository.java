package com.genie.Drive_BE.repo;

import com.genie.Drive_BE.entity.FileEntity;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FileRepository extends MongoRepository<FileEntity, String> {
    List<FileEntity> findByIsTrash(boolean isTrash);
    List<FileEntity> findByIsStarredAndIsTrash(boolean isStarred, boolean isTrash);
    List<FileEntity> findByParentFolderIdAndIsTrash(String parentFolderId, boolean isTrash);
    List<FileEntity> findByTypeContainingIgnoreCaseAndIsTrash(String type, boolean isTrash);
}
