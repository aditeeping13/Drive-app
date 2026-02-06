import React, { useRef } from "react";
import "./Sidebar.css";
import StorageInfo from "./StorageInfo";

function Sidebar({ onFileSelect, onCategorySelect, currentCategory, storageStats, onNotify }) {
  const hiddenFileInput = useRef(null);

  const handleClick = () => {
    hiddenFileInput.current.click();
  };

  const handleChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      onFileSelect(file); // Pass file to DriveApp
    }
  };

  const categories = [
    {
      id: "home",
      label: "Home",
      icon: <img src="https://cdn-icons-png.flaticon.com/512/1946/1946488.png" width="20" height="20" alt="Home" />
    },
    {
      id: "my-drive",
      label: "My Drive",
      icon: <img src="https://cdn-icons-png.flaticon.com/512/3767/3767084.png" width="20" height="20" alt="My Drive" />
    },
    {
      id: "shared-with-me",
      label: "Shared with me",
      icon: <img src="https://cdn-icons-png.flaticon.com/512/932/932781.png" width="20" height="20" alt="Shared" />
    },
    {
      id: "recent",
      label: "Recent",
      icon: <img src="https://cdn-icons-png.flaticon.com/512/3239/3239945.png" width="20" height="20" alt="Recent" />
    },
    {
      id: "starred",
      label: "Starred",
      icon: <img src="https://cdn-icons-png.flaticon.com/512/1828/1828884.png" width="20" height="20" alt="Starred" />
    },
    {
      id: "trash",
      label: "Trash",
      icon: <img src="https://cdn-icons-png.flaticon.com/512/1214/1214428.png" width="20" height="20" alt="Trash" />
    },
    {
      id: "storage",
      label: "Storage",
      icon: <img src="https://cdn-icons-png.flaticon.com/512/3011/3011702.png" width="20" height="20" alt="Storage" />
    },
  ];

  return (
    <div className="sidebar">
      <button className="new-btn" onClick={handleClick}>
        <img
          src="https://cdn-icons-png.flaticon.com/512/992/992651.png"
          alt="New"
          width="20"
          style={{ marginRight: "12px" }}
        />
        New
      </button>

      <input
        type="file"
        ref={hiddenFileInput}
        onChange={handleChange}
        style={{ display: "none" }}
      />

      <ul className="sidebar-nav">
        {categories.map((cat) => (
          <li
            key={cat.id}
            className={currentCategory === cat.id ? "active" : ""}
            onClick={() => onCategorySelect(cat.id)}
          >
            <span className="sidebar-icon">{cat.icon}</span>
            <span className="sidebar-label">{cat.label}</span>
          </li>
        ))}
      </ul>

      <div className="sidebar-footer">
        <StorageInfo stats={storageStats} onNotify={onNotify} />
      </div>
    </div>
  );
}

export default Sidebar;
