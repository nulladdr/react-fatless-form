import React from "react";
import styles from "./FileInput.module.css";

type FilesProps = {
    fileList: File[];
    selectedFiles: Set<File>;
    onToggleSelect: (file: File) => void;
    handleSelectAll: () => void;
    onRemoveFiles: () => void;
};

export function FileList({ fileList, selectedFiles, onToggleSelect, handleSelectAll, onRemoveFiles }: FilesProps) {
    return (
        <div style={{ marginTop: "10px" }}>
            {fileList.length > 1 && (
                <div className={styles.selectAllContainer}>
                    <input
                        type="checkbox"
                        checked={fileList.length === selectedFiles.size}
                        onChange={handleSelectAll}
                        className={styles.selectAllCheckbox}
                    />
                    <span className={styles.selectAllLabel}>Select All</span>
                </div>
            )}
            {fileList.map((file, index) => (
                <div
                    key={index}
                    style={{
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "5px",
                    }}
                >
                    <input
                        type="checkbox"
                        checked={selectedFiles.has(file)}
                        onChange={() => onToggleSelect(file)}
                        style={{ marginRight: "10px" }}
                    />
                    <span style={{ fontSize: "0.9rem", color: "#808080" }}>{file.name}</span>
                </div>
            ))}
            {selectedFiles.size > 0 && (
                <button
                    type="button"
                    onClick={onRemoveFiles}
                    style={{
                        marginTop: "10px",
                        backgroundColor: "transparent",
                        color: "red",
                        border: "none",
                        cursor: "pointer",
                        textDecoration: "underline",
                        fontSize: "0.9rem",
                    }}
                >
                    Remove Selected
                </button>
            )}
        </div>
    );
}
