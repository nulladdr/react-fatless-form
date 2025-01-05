type UseFileHandlerProps = {
    accept?: string;
    multiple: boolean;
    value: FileList | null;
    onChange: (files: FileList | null) => void;
};

export function useFileHandler({ accept, multiple, value, onChange }: UseFileHandlerProps) {
    const handleFiles = (files: FileList) => {
        const currentFiles = value ? Array.from(value) : [];
        const validFiles = Array.from(files).filter((file) => {
            if (!accept) return true;
            const acceptedTypes = accept.split(",").map((type) => type.trim().toLowerCase());
            return acceptedTypes.some((type) =>
                file.type === type || file.name.toLowerCase().endsWith(type.replace("*", ""))
            );
        });

        const newFiles = validFiles.filter(
            (newFile) => !currentFiles.some((currentFile) => currentFile.name === newFile.name)
        );

        const updatedFiles = multiple ? [...currentFiles, ...newFiles] : newFiles;
        const dataTransfer = new DataTransfer();
        updatedFiles.forEach((file) => dataTransfer.items.add(file));
        onChange(dataTransfer.files);
    };

    const fileArray = value ? Array.from(value) : [];

    return { fileArray, handleFiles };
}
