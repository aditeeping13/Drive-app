import React from "react";
import "./StorageInfo.css";

const StorageInfo = ({ stats, onNotify }) => {
  if (!stats) return null;

  const usedGB = (stats.totalSize / (1024 * 1024 * 1024)).toFixed(2);
  const limitGB = (stats.limit / (1024 * 1024 * 1024)).toFixed(0);
  const percentage = (stats.totalSize / stats.limit) * 100;

  return (
    <div className="storage-info">
      <div className="storage-header">
        <img
          src="https://cdn-icons-png.flaticon.com/512/10331/10331610.png"
          alt="cloud"
          width="20"
        />
        <span>Storage</span>
      </div>
      <div className="progress-bar-container">
        <div className="progress-bar" style={{ width: `${percentage}%` }}></div>
      </div>
      <p className="storage-text">
        {usedGB} GB of {limitGB} GB used
      </p>
      <button className="buy-storage-btn" onClick={() => onNotify("Storage limit successfully increased!", "success")}>
        Get more storage
      </button>
    </div>
  );
};

export default StorageInfo;
