import React, { useRef, useState } from "react";

export const FileUpload = ({
  name,
  label,
  accept = ".pdf",
  maxSize = 10 * 1024 * 1024, // 10MB
  onChange,
  error,
  value,
}) => {
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState(value?.name || "");
  const [fileError, setFileError] = useState("");

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setFileError("");

    // Validate file type
    const fileExtension = file.name.split(".").pop().toLowerCase();
    if (!accept.includes(`.${fileExtension}`)) {
      setFileError(`Only ${accept} files are allowed`);
      return;
    }

    // Validate file size
    if (file.size > maxSize) {
      const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(0);
      setFileError(`File size must not exceed ${maxSizeMB}MB`);
      return;
    }

    setFileName(file.name);
    if (onChange) {
      onChange(file);
    }
  };

  const handleRemove = () => {
    setFileName("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (onChange) {
      onChange(null);
    }
  };

  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}

      <div className="relative">
        <input
          ref={fileInputRef}
          type="file"
          name={name}
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
        />

        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
        >
          <svg
            className="mx-auto h-12 w-12 text-gray-400 mb-2"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20a4 4 0 004 4h24a4 4 0 004-4V20"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M32 4v12m0 0l-4-4m4 4l4-4"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          {fileName ? (
            <div>
              <p className="text-sm font-medium text-green-600">{fileName}</p>
              <p className="text-xs text-gray-500 mt-1">Click to change</p>
            </div>
          ) : (
            <div>
              <p className="text-sm text-gray-700">
                Drag and drop your file here, or click to select
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {accept} up to {(maxSize / (1024 * 1024)).toFixed(0)}MB
              </p>
            </div>
          )}
        </div>
      </div>

      {fileName && !error && !fileError && (
        <div className="mt-2 flex items-center justify-between bg-green-50 p-2 rounded">
          <p className="text-sm text-green-700">{fileName}</p>
          <button
            type="button"
            onClick={handleRemove}
            className="text-red-600 hover:text-red-800 text-sm font-medium"
          >
            Remove
          </button>
        </div>
      )}

      {(error || fileError) && (
        <p className="error-text mt-2">{error || fileError}</p>
      )}
    </div>
  );
};
