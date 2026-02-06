import React from "react";
import "./Header.css";

function Header({ onSearch, children }) {
  return (
    <div className="header-unified">
      <div className="header-top">
        <h2>Welcome to Drive</h2>
        <input
          type="text"
          placeholder="Search in Drive"
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
      <div className="header-actions-area">
        {children}
      </div>
    </div>
  );
}

export default Header;
