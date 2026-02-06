import React from "react";
import "./FileCard.css";

const FileCard = ({ file, onDownload, onDelete, onStar, onRestore, onFolderClick, isTrashView }) => {
  const getFileIcon = (file) => {
    if (file.folder || file.isFolder) return "https://cdn-icons-png.flaticon.com/512/3767/3767084.png";
    const ext = file.name.split(".").pop().toLowerCase();

    if (ext === "pdf")
      return "https://cdn-icons-png.flaticon.com/512/337/337946.png";
    if (["doc", "docx"].includes(ext))
      return "https://cdn-icons-png.flaticon.com/512/337/337932.png";
    if (["xls", "xlsx"].includes(ext))
      return "https://cdn-icons-png.flaticon.com/512/337/337959.png";
    if (["ppt", "pptx"].includes(ext))
      return "https://cdn-icons-png.flaticon.com/512/337/337948.png";
    if (["jpg", "jpeg", "png", "gif"].includes(ext))
      return "https://cdn-icons-png.flaticon.com/512/337/337940.png";
    if (["mp3", "wav"].includes(ext))
      return "https://cdn-icons-png.flaticon.com/512/337/337953.png";
    if (["txt", "log", "md"].includes(ext))
      return "https://cdn-icons-png.flaticon.com/512/337/337956.png";

    return "https://cdn-icons-png.flaticon.com/512/337/337947.png";
  };

  return (
    <div
      className={`file-card ${file.starred ? "starred" : ""}`}
      onClick={(e) => {
        if (e.target.closest("button")) return;
        if (file.folder || file.isFolder) {
          onFolderClick(file);
        } else {
          onDownload(file.id);
        }
      }}
    >
      <div className="card-top">
        <button
          className={`star-btn ${file.starred ? "active" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            onStar(file.id);
          }}
        >
          {file.starred ? "⭐" : "☆"}
        </button>
      </div>

      <img src={getFileIcon(file)} alt="file icon" />
      <div className="file-info">
        <p className="file-name" title={file.name}>{file.name}</p>
        {!(file.folder || file.isFolder) && <p className="file-size">{(file.size / 1024).toFixed(2)} KB</p>}
        <div className="file-meta">
          <span>👤 {file.owner}</span>
        </div>
      </div>

      <div className="card-actions">
        {isTrashView && (
          <button
            className="restore-btn"
            title="Restore"
            onClick={(e) => {
              e.stopPropagation();
              onRestore(file.id);
            }}
          >
            🔄
          </button>
        )}
        <button
          className="delete-btn"
          title={isTrashView ? "Delete Permanently" : "Move to Trash"}
          onClick={(e) => {
            e.stopPropagation();
            onDelete(file.id);
          }}
        >
          🗑️
        </button>
      </div>
    </div>
  );
};

export default FileCard;
