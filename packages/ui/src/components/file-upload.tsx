import { cn } from "@repo/ui/lib/utils";
import { File, FileText, Image as ImageIcon, Upload, X } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { useDropzone } from "react-dropzone";

import { Button } from "./button";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Progress } from "./progress";

function getFileIcon(file: File) {
  const type = file.type;
  if (type.startsWith("image/"))
    return <ImageIcon className="text-muted-foreground h-4 w-auto" />;
  if (
    type === "text/plain" ||
    type === "application/msword" ||
    type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  )
    return <FileText className="text-muted-foreground h-4 w-auto" />;
  return <File className="text-muted-foreground h-4 w-auto" />;
}

export function FilePreviewPopover({
  file,
  children,
}: {
  file: File;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const url = useMemo(() => URL.createObjectURL(file), [file]);
  const isImage = file.type.startsWith("image/");
  const isPdf = file.type === "application/pdf";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
          tabIndex={0}
          className="w-full outline-none"
        >
          {children}
        </div>
      </PopoverTrigger>
      <PopoverContent
        className="w-full"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
      >
        <div className="flex flex-col gap-2">
          <div className="space-y-1">
            <p className="break-all text-sm font-medium">{file.name}</p>
            <p className="text-muted-foreground text-xs">
              {(file.size / 1024).toFixed(1)} KB
            </p>
          </div>
          {isImage && (
            <img
              src={url}
              alt={file.name}
              className="max-h-[350px] max-w-full rounded border"
            />
          )}
          {isPdf && (
            <div className="flex flex-col items-center">
              <embed
                src={url}
                type="application/pdf"
                width="550px"
                height="550px"
              />
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

interface FileUploadProps {
  value?: File | null;
  onChange: (file: File | null) => void;
  accept?: Record<string, string[]>;
  hasError?: boolean;
  className?: string;
}

interface FileUploadState {
  file: File | null;
  progress: number;
  isUploading: boolean;
}

export function FileUpload({
  value,
  onChange,
  accept,
  hasError = false,
  className,
}: FileUploadProps) {
  const [uploadState, setUploadState] = useState<FileUploadState>({
    file: null,
    progress: 0,
    isUploading: false,
  });

  const simulateUpload = useCallback(
    async (file: File) => {
      setUploadState((prev) => ({ ...prev, isUploading: true, progress: 0 }));

      for (let i = 0; i <= 100; i += 10) {
        await new Promise((resolve) => setTimeout(resolve, 100));
        setUploadState((prev) => ({ ...prev, progress: i }));
      }

      onChange(file);
      setUploadState((prev) => ({ ...prev, isUploading: false }));
    },
    [onChange]
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) {
        setUploadState((prev) => ({ ...prev, file }));
        simulateUpload(file);
      }
    },
    [simulateUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: accept || undefined,
  });

  const removeFile = () => {
    setUploadState({ file: null, progress: 0, isUploading: false });
    onChange(null);
  };

  const currentFile = uploadState.file || value;

  return (
    <div className={cn("flex h-9 w-full justify-center", className)}>
      {!currentFile ? (
        <div
          {...getRootProps()}
          className={cn(
            "flex h-full w-full cursor-pointer items-center justify-center rounded-md border-2 border-dashed text-center transition-colors",
            isDragActive
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25",
            hasError ? "border-destructive" : "",
            "hover:border-primary hover:bg-primary/5"
          )}
        >
          <input {...getInputProps()} />
          <Upload className="text-muted-foreground h-4 w-auto" />
        </div>
      ) : (
        <div className="flex h-full w-full items-center justify-center space-y-2">
          {!uploadState.isUploading ? (
            <FilePreviewPopover file={currentFile}>
              <div className="flex w-full min-w-0 items-center justify-between rounded-md border pl-2">
                <div className="flex min-w-0 flex-1 items-center gap-x-1.5">
                  <span className="flex-shrink-0">
                    {getFileIcon(currentFile)}
                  </span>
                </div>
                <span className="ml-5 w-full min-w-0 truncate text-xs font-medium">
                  {currentFile.name}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={removeFile}
                  disabled={uploadState.isUploading}
                  className="ml-1"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </FilePreviewPopover>
          ) : (
            <div className="flex h-full w-full items-center">
              <Progress value={uploadState.progress} className="h-2" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
