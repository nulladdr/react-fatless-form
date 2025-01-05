import { useState } from "react";

export function useFileSelection(
    fileArray: File[],
    onChange: (files: FileList | null) => void
) {
    const [selectedFiles, setSelectedFiles] = useState<Set<File>>(new Set());

    const handleToggleSelect = (file: File) => {
        const updatedSelectedFiles = new Set(selectedFiles);
        updatedSelectedFiles.has(file) ? updatedSelectedFiles.delete(file) : updatedSelectedFiles.add(file);
        setSelectedFiles(updatedSelectedFiles);
    };

    const handleRemoveSelectedFiles = () => {
        const remainingFiles = fileArray.filter((file) => !selectedFiles.has(file));
        const dataTransfer = new DataTransfer();
        remainingFiles.forEach((file) => dataTransfer.items.add(file));
        setSelectedFiles(new Set());
        onChange(dataTransfer.files.length ? dataTransfer.files : null);
    };

    const handleSelectAll = () => {
        setSelectedFiles(fileArray.length === selectedFiles.size ? new Set() : new Set(fileArray));
    };

    return {
        selectedFiles,
        handleToggleSelect,
        handleRemoveSelectedFiles,
        handleSelectAll,
    };
}
