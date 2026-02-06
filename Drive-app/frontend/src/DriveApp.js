import React, { useState, useEffect, useRef, useCallback } from "react";
import Sidebar from "../src/component/Sidebar";
import Header from "../src/component/Header";
import FileCard from "../src/component/FileCard";
import axios from "axios";
import "./DriveApp.css";
import Breadcrumb from "../src/component/Breadcrumb";
import Modal from "../src/component/Modal";
import Notification from "../src/component/Notification";

function DriveApp() {
  const [files, setFiles] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentCategory, setCurrentCategory] = useState("home");
  const [parentFolderId, setParentFolderId] = useState(null);
  const [folderStack, setFolderStack] = useState([]);
  const [storageStats, setStorageStats] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Notification & Modal State
  const [notification, setNotification] = useState(null);
  const [modalConfig, setModalConfig] = useState({ isOpen: false });

  const triggerRefresh = () => setRefreshTrigger((prev) => prev + 1);

  const fetchFiles = useCallback(async () => {
    try {
      let url = `${process.env.REACT_APP_API_URL}/api/files/list?category=${currentCategory}&_t=${Date.now()}`;
      if (parentFolderId && currentCategory === "my-drive") {
        url += `&parentFolderId=${parentFolderId}`;
      }
      const res = await axios.get(url);
      setFiles(res.data);
    } catch (error) {
      console.error("Error fetching files:", error);
    }
  }, [currentCategory, parentFolderId]);

  const fetchStorageStats = useCallback(async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/files/storage-stats?_t=${Date.now()}`);
      setStorageStats(res.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  }, []);

  useEffect(() => {
    fetchFiles();
    fetchStorageStats();
  }, [fetchFiles, fetchStorageStats, refreshTrigger]);

  const showNotification = (message, type = "info") => {
    setNotification({ message, type });
  };

  const handleUploadFromSidebar = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    if (parentFolderId) formData.append("parentFolderId", parentFolderId);

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/files/upload`, formData);
      showNotification(`Uploaded ${file.name}`, "success");
      triggerRefresh();
    } catch (error) {
      showNotification("Upload failed", "error");
    }
  };

  const handleCreateFolder = () => {
    setModalConfig({
      isOpen: true,
      title: "New Folder",
      message: "Enter a name for the new folder:",
      type: "prompt",
      placeholder: "Untitled Folder",
      onConfirm: async (folderName) => {
        if (!folderName) return;
        try {
          let url = `${process.env.REACT_APP_API_URL}/api/files/create-folder?name=${folderName}`;
          if (parentFolderId) url += `&parentFolderId=${parentFolderId}`;
          await axios.post(url);
          showNotification(`Created folder "${folderName}"`, "success");
          setModalConfig({ isOpen: false });
          triggerRefresh();
        } catch (error) {
          showNotification("Failed to create folder", "error");
        }
      },
      onCancel: () => setModalConfig({ isOpen: false }),
    });
  };

  const handleFolderClick = (folder) => {
    setParentFolderId(folder.id);
    setFolderStack([...folderStack, folder]);
    setCurrentCategory("my-drive");
  };

  const handleBreadcrumbClick = (id, index) => {
    setParentFolderId(id);
    setFolderStack(folderStack.slice(0, index + 1));
  };

  const handleDownload = (id) => {
    window.location.href = `${process.env.REACT_APP_API_URL}/api/files/download/${id}`;
  };

  const handleToggleStar = async (id) => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/files/star/${id}`);
      triggerRefresh();
    } catch (error) {
      showNotification("Failed to toggle star", "error");
    }
  };

  const handleMoveToTrash = async (id) => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/files/trash/${id}`);
      showNotification("Moved to trash");
      triggerRefresh();
    } catch (error) {
      showNotification("Failed to move to trash", "error");
    }
  };

  const handleRestore = async (id) => {
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/files/restore/${id}`);
      showNotification("File restored", "success");
      triggerRefresh();
    } catch (error) {
      showNotification("Failed to restore file", "error");
    }
  };

  const handleDeletePermanent = async (id, fileName) => {
    setModalConfig({
      isOpen: true,
      title: "Delete Permanently",
      message: `Are you sure you want to permanently delete "${fileName}"? This cannot be undone.`,
      type: "confirm",
      onConfirm: async () => {
        try {
          await axios.delete(`${process.env.REACT_APP_API_URL}/api/files/delete/${id}`);
          showNotification("Deleted permanently");
          setModalConfig({ isOpen: false });
          triggerRefresh();
        } catch (error) {
          showNotification("Delete failed", "error");
        }
      },
      onCancel: () => setModalConfig({ isOpen: false }),
    });
  };

  const filteredFiles = files.filter((file) =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCategoryChange = (cat) => {
    setCurrentCategory(cat);
    setParentFolderId(null);
    setFolderStack([]);
  };

  const actionFileInput = useRef(null);

  const renderDashboard = () => {
    const suggested = filteredFiles.slice(0, 4);
    const recent = filteredFiles.slice(4);

    return (
      <div className="dashboard-wrapper">
        <div className="dashboard-top-row">
          <section className="dashboard-section suggested-section">
            <div className="section-header">
              <h2>Suggested</h2>
              <button className="view-all-link">View all</button>
            </div>
            <div className="suggested-grid">
              {suggested.map((file) => (
                <FileCard
                  key={file.id}
                  file={file}
                  onDownload={handleDownload}
                  onDelete={() => handleMoveToTrash(file.id)}
                  onStar={() => handleToggleStar(file.id)}
                  onRestore={() => handleRestore(file.id)}
                  onFolderClick={handleFolderClick}
                />
              ))}
            </div>
          </section>

          <section className="dashboard-section quick-access-section">
            <h2>Quick Access</h2>
            <div className="quick-access-grid">
              {[
                { label: "PDFs", icon: "📄", type: "pdf", color: "#fee2e2" },
                { label: "Docs", icon: "📝", type: "document", color: "#dbeafe" },
                { label: "Images", icon: "🖼️", type: "image", color: "#dcfce7" },
              ].map((item) => (
                <button
                  key={item.type}
                  className="quick-card-pro"
                  style={{ "--accent-color": item.color }}
                  onClick={() => setSearchTerm(item.type)}
                >
                  <div className="quick-icon-pro">{item.icon}</div>
                  <div className="quick-info-pro">
                    <span className="quick-label-pro">{item.label}</span>
                    <span className="quick-sub-pro">Documents</span>
                  </div>
                </button>
              ))}
            </div>
          </section>
        </div>

        <section className="dashboard-section recent-section">
          <h2>Recently Accessed</h2>
          <div className="files-grid">
            {recent.map((file) => (
              <FileCard
                key={file.id}
                file={file}
                onDownload={handleDownload}
                onDelete={() => handleMoveToTrash(file.id)}
                onStar={() => handleToggleStar(file.id)}
                onRestore={() => handleRestore(file.id)}
                onFolderClick={handleFolderClick}
              />
            ))}
          </div>
        </section>
      </div>
    );
  };

  return (
    <div className="main-layout">
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
      <Modal {...modalConfig} />
      <Sidebar
        onFileSelect={handleUploadFromSidebar}
        onCategorySelect={handleCategoryChange}
        currentCategory={currentCategory}
        storageStats={storageStats}
        onNotify={showNotification}
      />
      <div className="content-area">
        <Header onSearch={setSearchTerm}>
          <div className="unified-actions-row">
            <Breadcrumb folderStack={folderStack} onBreadcrumbClick={handleBreadcrumbClick} />

            <div className="action-buttons">
              {(currentCategory === "my-drive" || currentCategory === "home") && (
                <>
                  <button
                    className="action-btn upload-btn"
                    onClick={() => actionFileInput.current.click()}
                  >
                    📤 Upload File
                  </button>
                  <button className="action-btn create-btn" onClick={handleCreateFolder}>
                    + New Folder
                  </button>
                  <input
                    type="file"
                    ref={actionFileInput}
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) handleUploadFromSidebar(file);
                    }}
                    style={{ display: "none" }}
                  />
                </>
              )}
            </div>
          </div>
        </Header>

        {filteredFiles.length === 0 ? (
          <div className="empty-state">
            <img src="/default.svg" alt="No Files" style={{ width: "300px" }} />
            <p>
              {currentCategory === "trash" ? "Trash is empty" : "No files found here"}
            </p>
          </div>
        ) : currentCategory === "home" && !searchTerm ? (
          renderDashboard()
        ) : (
          <div className="files-grid">
            {filteredFiles.map((file) => (
              <FileCard
                key={file.id}
                file={file}
                onDownload={handleDownload}
                onDelete={
                  currentCategory === "trash"
                    ? () => handleDeletePermanent(file.id, file.name)
                    : () => handleMoveToTrash(file.id)
                }
                onStar={() => handleToggleStar(file.id)}
                onRestore={() => handleRestore(file.id)}
                onFolderClick={handleFolderClick}
                isTrashView={currentCategory === "trash"}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default DriveApp;
