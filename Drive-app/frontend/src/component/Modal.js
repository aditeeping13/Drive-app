import React, { useState } from "react";
import "./Modal.css";

const Modal = ({ isOpen, title, message, type, onConfirm, onCancel, placeholder }) => {
  const [inputValue, setInputValue] = useState("");

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>{title}</h3>
        <p>{message}</p>

        {type === "prompt" && (
          <input
            type="text"
            className="modal-input"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={placeholder}
            autoFocus
          />
        )}

        <div className="modal-actions">
          <button className="modal-btn cancel" onClick={onCancel}>
            Cancel
          </button>
          <button
            className="modal-btn confirm"
            onClick={() => {
              onConfirm(type === "prompt" ? inputValue : true);
              setInputValue("");
            }}
          >
            {type === "prompt" ? "Create" : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
