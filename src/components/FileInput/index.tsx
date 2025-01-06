import React from "react";
import { useDragAndDrop } from "../../hooks/useDragAndDrop";
import { useFileHandler } from "../../hooks/useFileHandler";
import { useFileSelection } from "../../hooks/useFileSelection";
import { Files } from "./Files";

export type FileInputType = {
    type: "file";
    name: string;
    label?: string;
    accept?: string;
    multiple?: boolean;
    value: FileList | null;
    onChange: (files: FileList | null) => void;
    className?: string;
    style?: React.CSSProperties;
    disabled?: boolean;
    error?: string,
};

export function FileInput({
    name,
    label = '',
    accept,
    multiple = false,
    value,
    onChange,
    className,
    style,
    error = '',
}: FileInputType) {
    const { handleFiles, fileArray } = useFileHandler({ accept, multiple, value, onChange });
    const { isDragging, handleDragOver, handleDragLeave, handleDrop } = useDragAndDrop({ handleFiles });
    const {
        selectedFiles,
        handleToggleSelect,
        handleRemoveSelectedFiles,
        handleSelectAll,
    } = useFileSelection(fileArray, onChange);

    return (
        <>
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={className}
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px",
                    border: `1px dashed ${error ? 'rgb(184, 0, 0)' : '#0078d4'}`,
                    borderRadius: "5px",
                    backgroundColor: isDragging ? "#e6f7ff" : "#fff",
                    height: "50px",
                    ...style,
                }}
            >
                <label htmlFor={name} style={{ display: "flex", alignItems: "center", color: "#A9A9A9", cursor: "pointer" }}>
                    &#10514;
                    <span style={{ marginLeft: "5px", fontSize: "0.9rem" }}>{`Click to upload or drop ${label} here`}</span>
                </label>
                <span style={{ color: "#A9A9A9" }}>{accept ? accept.replace(/,/g, ", ") : "Any file"}</span>
            </div>

            <input
                id={name}
                type="file"
                name={name}
                accept={accept}
                multiple={multiple}
                style={{ display: "none" }}
                onChange={(e) => e.target.files && handleFiles(e.target.files)}
            />

            <div style={{ marginTop: "10px" }}>
                {fileArray.length === 0 ? (
                    <span style={{ color: error ? "rgb(184, 0, 0)" : "#A9A9A9", fontSize: ".8rem" }}>{error ? error : 'No file uploaded yet'}</span>
                ) : (
                    <div>
                        {fileArray.length > 1 && (
                            <div style={{ marginBottom: "10px", color: "#A9A9A9" }}>
                                <input
                                    type="checkbox"
                                    checked={fileArray.length === selectedFiles.size}
                                    onChange={handleSelectAll}
                                    style={{ marginRight: "10px" }}
                                />
                                <span style={{ color: "#A9A9A9" }}>Select All</span>
                            </div>
                        )}

                        <Files
                            fileList={fileArray}
                            selectedFiles={selectedFiles}
                            onToggleSelect={handleToggleSelect}
                            onRemoveFiles={handleRemoveSelectedFiles}
                        />
                    </div>
                )}
            </div>
        </>
    );
}
