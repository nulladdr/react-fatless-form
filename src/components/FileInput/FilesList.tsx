import React from "react";
import { Checkbox } from "components/Checkbox";
import styles from "./FileInput.module.css";

type FilesProps = {
  fileList: File[];
  selectedFiles: Set<File>;
  onToggleSelect: (file: File) => void;
  handleSelectAll: () => void;
  onRemoveFiles: () => void;
};

export function FileList({
  fileList,
  selectedFiles,
  onToggleSelect,
  handleSelectAll,
  onRemoveFiles,
}: FilesProps) {
  // Map File[] to option[] format
  const options = fileList.map((file) => ({
    label: file.name,
    value: file.name,
  }));

  // Build current selected values based on Set<File>
  const selectedNames = [...selectedFiles].map((f) => f.name);

  const handleMultiCheckboxChange = (selectedValues: string[]) => {
    const newSelected = new Set<File>();

    for (const file of fileList) {
      if (selectedValues.includes(file.name)) {
        newSelected.add(file);
      }
    }

    // Instead of replacing selectedFiles directly,
    // we call onToggleSelect for diffing
    fileList.forEach((file) => {
      const isCurrentlySelected = selectedFiles.has(file);
      const shouldBeSelected = newSelected.has(file);
      if (isCurrentlySelected !== shouldBeSelected) {
        onToggleSelect(file);
      }
    });
  };

  return (
    <div style={{ marginTop: "10px" }}>
      {fileList.length > 1 && (
        <div className={styles.selectAllContainer}>
          <Checkbox
            type="checkbox"
            name="selectAll"
            label="Select All"
            value={fileList.length === selectedFiles.size}
            onChange={handleSelectAll}
          />
        </div>
      )}

      <Checkbox
        type="checkbox"
        name="fileSelection"
        options={options}
        value={selectedNames}
        onChange={handleMultiCheckboxChange}
      />

      {selectedFiles.size > 0 && (
        <button
          type="button"
          onClick={onRemoveFiles}
          onMouseEnter={(e) =>
            (e.currentTarget.style.color = "var(--input-value)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.color =
              "var(--placeholder-color, #cccccc)")
          }
          style={{
            backgroundColor: "transparent",
            border: "none",
            cursor: "pointer",
            fontSize: "0.9rem",
            paddingLeft: 0,
            color: "var(--placeholder-color, #cccccc)",
          }}
        >
          Remove Selected
        </button>
      )}
    </div>
  );
}
