import React, { ChangeEvent, DragEvent, useRef, useState } from "react";
import * as XLSX from "xlsx";

import { ReactComponent as CSV } from "assets/images/icons/csv.svg";
import { ReactComponent as Excel } from "assets/images/icons/excel.svg";

import { useBulkUploadStore } from "pages/Beneficiaries/BulkUpload";

interface FileUploaderProps {
  onFileUpload: (data: any[][]) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onFileUpload }) => {
  const { originalFileName: fileName, setOriginalFileName: setFileName } =
    useBulkUploadStore();

  const [isDragging, setIsDragging] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const processFile = (file: File): void => {
    if (!file) return;

    const allowedTypes = [
      "text/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert("Please upload a CSV or Excel file");
      return;
    }

    setFileName(file.name);
    const reader = new FileReader();

    reader.onload = (evt: ProgressEvent<FileReader>): void => {
      try {
        const bstr = evt.target?.result as string;
        const wb = XLSX.read(bstr, { type: "binary" });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const jsonData = XLSX.utils.sheet_to_json(ws, {
          header: 1,
          defval: "",
        }) as any[][];

        onFileUpload(jsonData);
      } catch (error) {
        alert(
          "Error processing file. Please make sure it's a valid CSV/Excel file."
        );
        console.log(error);

        setFileName("");
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    processFile(file);
  };

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleClick = (): void => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full py-4">
      <div
        className={`relative flex min-h-[240px] cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center transition-all duration-500 ${
          isDragging
            ? "border-mint bg-mint/10"
            : "border-neutral-500 bg-white bg-opacity-0 backdrop-blur-sm hover:bg-opacity-20"
        } `}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileInput}
          accept=".csv,.xlsx,.xls"
        />

        <div className="mb-4 flex items-center gap-6 text-gray-500">
          <Excel />
          <CSV />
        </div>

        <div className="space-y-2">
          {fileName ? (
            <>
              <p className="font-semibold text-mint">{fileName}</p>
              <p className="text-sm text-white">
                Click or drag to upload another file
              </p>
            </>
          ) : (
            <>
              <p className="text-sm text-white">
                <span className="font-semibold text-mint underline">
                  Browse
                </span>{" "}
                or drag and drop your file here.
              </p>
              <p className="text-xs text-white/60">
                CSV, XLS, XLSX files supported
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileUploader;
