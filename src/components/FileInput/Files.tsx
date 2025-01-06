import React from "react";

type FilesProps = {
    fileList: File[];
    selectedFiles: Set<File>;
    onToggleSelect: (file: File) => void;
    onRemoveFiles: () => void;
};

export function Files({ fileList, selectedFiles, onToggleSelect, onRemoveFiles }: FilesProps) {
    return (
        <div>
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
                    <span>{file.name}</span>
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
                    }}
                >
                    Remove Selected
                </button>
            )}
        </div>
    );
}
