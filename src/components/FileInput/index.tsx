import React, { useRef } from "react";
import { useDragAndDrop } from "../../hooks/useDragAndDrop";
import { useFileHandler } from "../../hooks/useFileHandler";
import { useFileSelection } from "../../hooks/useFileSelection";
import { FileList } from "./FilesList";
import { useLabelStyle } from "../../hooks/useLabelStyle"
import styles from "./FileInput.module.css";
import globalStyles from "../Global.module.css";

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
    const [labelRef, dynamicStyles] = useLabelStyle(label)
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { handleFiles, fileArray } = useFileHandler({ accept, multiple, value, onChange });
    const { isDragging, handleDragOver, handleDragLeave, handleDrop } = useDragAndDrop({ handleFiles });
    const {
        selectedFiles,
        handleToggleSelect,
        handleRemoveSelectedFiles,
        handleSelectAll,
    } = useFileSelection(fileArray, onChange);

    const getClassNames = () => {
        return [
            globalStyles.inputWrapper,
            styles.container,
            isDragging && styles.dragging,
            error && globalStyles.inputWrapperError && styles.error,
            className
        ]
            .filter(Boolean)
            .join(' ');
    };

    return (
        <>
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={getClassNames()}
                style={{
                    ...dynamicStyles,
                    ...style
                }}
            >
                <label ref={labelRef} htmlFor={name} className={`${globalStyles.label} ${error ? globalStyles.errorLabel : ''}`}>{label}</label>
                <span className={styles.uploadSpan} onMouseEnter={(e) => (e.currentTarget.style.color = "#808080")} onMouseLeave={(e) => (e.currentTarget.style.color = "#ccc")} onClick={() => fileInputRef.current?.click()}>
                    &#10514;
                    <span style={{ marginLeft: "5px", fontSize: "0.9rem" }}>Click to select, or drag and drop files here</span>
                </span>
                <span className={styles.fileInfo}>{accept ? accept.replace(/,/g, ", ") : "Any file"}</span>
            </div>

            <input
                id={name}
                ref={fileInputRef}
                type="file"
                name={name}
                accept={accept}
                multiple={multiple}
                style={{ display: "none" }}
                onChange={(e) => e.target.files && handleFiles(e.target.files)}
            />

            <div>
                {fileArray.length === 0 ? (
                    <span
                        className={
                            error ? globalStyles.errorMessage : styles.noFileMessage
                        }
                    >
                        {error ? error : "No file uploaded yet"}
                    </span>
                ) : (
                    <FileList
                        fileList={fileArray}
                        selectedFiles={selectedFiles}
                        onToggleSelect={handleToggleSelect}
                        handleSelectAll={handleSelectAll}
                        onRemoveFiles={handleRemoveSelectedFiles}
                    />
                )}
            </div>
        </>
    );
}
