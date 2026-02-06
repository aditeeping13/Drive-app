import React, { useEffect } from "react";
import "./Notification.css";

const Notification = ({ message, type = "info", onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  if (!message) return null;

  return (
    <div className={`notification ${type}`}>
      <span className="notification-icon">
        {type === "success" ? "✅" : "ℹ️"}
      </span>
      <span className="notification-message">{message}</span>
      <button className="notification-close" onClick={onClose}>
        ×
      </button>
    </div>
  );
};

export default Notification;
