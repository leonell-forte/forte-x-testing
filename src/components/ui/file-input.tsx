import { TextFieldProps } from "@mui/material";
import { uploadFile } from "api/upload";
import classNames from "classnames";
import { motion } from "framer-motion";
import { ChangeEvent, useState } from "react";

import loader from "assets/images/icons/loader.svg";
import upload from "assets/images/icons/upload.svg";

import { useAlert } from "lib/hooks";
import { File as FileType } from "lib/types/common";

import Input from "./input";

type IProps = TextFieldProps & {
  filename?: string;

  accept?: string;

  raw?: boolean;

  onUploadStart?: (file?: File) => void;

  onUploadEnd?: () => void;

  onSuccess?: (data: FileType) => void;
};

const FileInput = ({
  filename,

  accept = "",

  raw,

  onSuccess,

  onUploadStart,

  onUploadEnd,

  ...props
}: IProps) => {
  const [loading, setLoading] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [value, setValue] = useState(filename || "");

  const { setAlert } = useAlert();

  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files![0];
    if (!file) return;
    setLoading(true);
    onUploadStart?.(file);

    if (!raw) {
      let interval: NodeJS.Timeout | undefined;

      const progressSteps = [15, 30, 60, 75, 90];
      let currentStepIndex = 0;

      // Start scanning animation
      interval = setTimeout(() => {
        setScanning(true);
        let scanProgress = 0;

        const updateProgress = async () => {
          const targetProgress = progressSteps[currentStepIndex];

          interval = setInterval(
            () => {
              if (scanProgress < targetProgress) {
                scanProgress += targetProgress === 75 ? 0.2 : 1; // Slower increment at 75%
                setProgress(scanProgress);
              } else {
                clearInterval(interval);
                if (currentStepIndex < progressSteps.length - 1) {
                  currentStepIndex++;
                  // Add longer delay at 75%
                  const delay =
                    targetProgress === 75
                      ? 4000 // 4 second delay after 75%
                      : Math.random() * 1000 + 1000;
                  setTimeout(updateProgress, delay);
                }
              }
            },
            targetProgress === 75 ? 100 : 50
          ); // Slower interval at 75%
        };

        updateProgress();
      }, 3000);

      try {
        const res = await uploadFile(file);
        setLoading(false);

        // Complete the scan progress
        setProgress(100);
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Show 100% briefly
        setScanning(false);
        onSuccess?.(res.data.data);
        setValue(res.data.data.filename);
      } catch (err: any) {
        setAlert({
          title: "Failed uploading file",
          message: err?.response?.data?.message,
          status: "error",
        });
      } finally {
        clearInterval(interval);
        onUploadEnd?.();
      }
    } else {
      setValue(file.name);
      setLoading(false);
    }
  };

  return (
    <div className="relative flex w-full cursor-pointer items-center">
      <Input
        color="primary"
        type="file"
        accept={accept}
        {...props}
        disabled={loading || scanning || props.disabled}
        onChange={handleUpload}
        className="absolute left-0 top-0 z-10 cursor-pointer"
      />

      {loading || scanning ? (
        scanning ? (
          <div className="absolute right-4 h-1.5 w-20 overflow-hidden rounded-full bg-gray-600/50">
            <motion.div
              className="h-full rounded-full bg-green-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{
                duration: 0.5,
                ease: "easeOut",
              }}
            />
          </div>
        ) : (
          <img
            src={loader}
            alt="loader"
            className="absolute right-4 w-4 animate-spin"
          />
        )
      ) : (
        <img src={upload} alt="upload" className="absolute right-4 w-3.5" />
      )}

      <div
        className={classNames(
          "pointer-events-none absolute left-4 w-full truncate pr-14 text-sm",
          value ? "text-white" : "text-white/50"
        )}
      >
        {scanning ? (
          progress === 100 ? (
            "Scanning complete"
          ) : (
            <span className="text-white/50">
              Scanning for virus
              <AnimatedEllipsis />
            </span>
          )
        ) : loading ? (
          "Uploading..."
        ) : (
          value || props.placeholder
        )}
      </div>
    </div>
  );
};

export default FileInput;

const AnimatedEllipsis = () => (
  <motion.span
    animate={{ opacity: 1 }}
    transition={{
      repeat: Infinity,
      duration: 1,
      ease: "linear",
      times: [0, 0.2, 0.4, 0.6, 0.8, 1],
    }}
  >
    <motion.span
      animate={{
        opacity: [0, 0, 0, 1, 1, 0],
      }}
      transition={{
        repeat: Infinity,
        duration: 1,
      }}
    >
      .
    </motion.span>
    <motion.span
      animate={{
        opacity: [0, 0, 1, 1, 0, 0],
      }}
      transition={{
        repeat: Infinity,
        duration: 1,
      }}
    >
      .
    </motion.span>
    <motion.span
      animate={{
        opacity: [0, 1, 1, 0, 0, 0],
      }}
      transition={{
        repeat: Infinity,
        duration: 1,
      }}
    >
      .
    </motion.span>
  </motion.span>
);
