import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./ImageUploader.css";

type ImageUploaderProps = {
  value?: File[];
  onChange?: (files: File[]) => void;
  accept?: string;
  maxFiles?: number;
  maxSizeMB?: number;
  disabled?: boolean;
};

const ImageUploader: React.FC<ImageUploaderProps> = ({
  value = [],
  onChange,
  accept = "image/*",
  maxFiles = 12,
  maxSizeMB = 8,
  disabled = false,
}) => {
  const [files, setFiles] = useState<File[]>(value);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => setFiles(value), [value]);

  const update = useCallback(
    (next: File[]) => {
      setFiles(next);
      onChange?.(next);
    },
    [onChange]
  );

  const pickFiles = useCallback(() => fileInputRef.current?.click(), []);

  const filterValid = useCallback(
    (list: FileList | File[]) => {
      const out: File[] = [];
      const maxBytes = maxSizeMB * 1024 * 1024;
      for (const f of Array.from(list)) {
        if (f.size <= maxBytes && f.type.startsWith("image/")) out.push(f);
      }
      return out;
    },
    [maxSizeMB]
  );

  const onFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files) return;
      const valid = filterValid(e.target.files);
      const merged = [...files, ...valid].slice(0, maxFiles);
      update(merged);
      e.target.value = "";
    },
    [files, filterValid, maxFiles, update]
  );

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      if (disabled) return;
      const valid = e.dataTransfer?.files ? filterValid(e.dataTransfer.files) : [];
      const merged = [...files, ...valid].slice(0, maxFiles);
      update(merged);
    },
    [disabled, files, filterValid, maxFiles, update]
  );
  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => e.preventDefault();

  const removeAt = useCallback(
    (idx: number) => update(files.filter((_, i) => i !== idx)),
    [files, update]
  );

  const previews = useMemo(() => files.map((f) => URL.createObjectURL(f)), [files]);
  useEffect(() => () => previews.forEach((u) => URL.revokeObjectURL(u)), [previews]);

  return (
    <div className={`iu-root ${disabled ? "is-disabled" : ""}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple
        onChange={onFileChange}
        style={{ display: "none" }}
        disabled={disabled}
      />

      <div
        className="iu-dropzone"
        onDrop={onDrop}
        onDragOver={onDragOver}
        aria-label="Bilder hierher ziehen oder auswählen"
      >
        <div className="iu-drop-inner">
          <div className="iu-drop-icon">🖼️</div>
          <div className="iu-drop-text">
            <strong>Drag & Drop</strong> oder{" "}
            <span className="iu-link" onClick={pickFiles}>Dateien wählen</span>
            <br />
            <small>Nur Bilder, bis {maxSizeMB} MB / Datei</small>
          </div>
          <span className="iu-counter-badge">{files.length}/{maxFiles}</span>
        </div>
      </div>

      {files.length > 0 && (
        <div className="iu-grid">
          {previews.map((url, i) => (
            <div className="iu-thumb" key={url}>
              <img src={url} alt={`Bild ${i + 1}`} loading="lazy" />
              <button
                type="button"
                className="iu-remove"
                aria-label="Bild entfernen"
                onClick={() => removeAt(i)}
                title="Entfernen"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
