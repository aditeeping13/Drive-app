import React from "react";
import "./Breadcrumb.css";

const Breadcrumb = ({ folderStack, onBreadcrumbClick }) => {
  return (
    <div className="breadcrumb">
      <span className="breadcrumb-item" onClick={() => onBreadcrumbClick(null, -1)}>
        My Drive
      </span>
      {folderStack.map((folder, index) => (
        <span key={folder.id}>
          <span className="breadcrumb-separator">/</span>
          <span
            className="breadcrumb-item"
            onClick={() => onBreadcrumbClick(folder.id, index)}
          >
            {folder.name}
          </span>
        </span>
      ))}
    </div>
  );
};

export default Breadcrumb;
