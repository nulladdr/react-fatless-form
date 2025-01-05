import { useState } from "react";

type UseDragAndDropProps = {
    handleFiles: (files: FileList) => void;
};

export function useDragAndDrop({ handleFiles }: UseDragAndDropProps) {
    const [isDragging, setIsDragging] = useState(false);

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files) handleFiles(e.dataTransfer.files);
    };

    return { isDragging, handleDragOver, handleDragLeave, handleDrop };
}
