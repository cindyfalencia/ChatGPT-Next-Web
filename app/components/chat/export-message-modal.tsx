import React from "react";
import { Modal } from "../ui-lib";
import { IconButton } from "../button";
import ConfirmIcon from "../icons/confirm.svg";
import CancelIcon from "../icons/cancel.svg";
import styles from "../exporter.module.scss";

// Define prop types
interface ExportMessageModalProps {
  onClose: () => void;
}

const ExportMessageModal: React.FC<ExportMessageModalProps> = ({ onClose }) => {
  const handleExport = (format: "txt" | "json") => {
    console.log(`Exporting as ${format.toUpperCase()}`); // Replace with actual export logic
  };

  return (
    <Modal title="Export Messages" onClose={onClose}>
      <div className={styles["message-exporter-body"]}>
        <p>Choose your export format:</p>
        <div className={styles["preview-actions"]}>
          <button
            className={styles["export-button"]}
            onClick={() => handleExport("txt")}
          >
            Export as TXT
          </button>
          <button
            className={styles["export-button"]}
            onClick={() => handleExport("json")}
          >
            Export as JSON
          </button>
        </div>
      </div>
      <div className={styles["preview-actions"]}>
        <IconButton
          icon={<CancelIcon />}
          text="Cancel"
          onClick={onClose}
          aria-label="Cancel Export"
        />
        <IconButton
          icon={<ConfirmIcon />}
          text="Confirm"
          onClick={() => console.log("Export confirmed")} // Replace with actual export logic
          aria-label="Confirm Export"
        />
      </div>
    </Modal>
  );
};

export default ExportMessageModal;
