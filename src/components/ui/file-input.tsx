import { TextFieldProps } from "@mui/material";
import { uploadFile } from "api/upload";
import classNames from "classnames";
import { motion } from "framer-motion";
import { ChangeEvent, useState } from "react";
import { create } from "zustand";

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
  const { loading, setLoading, scanning, setScanning, setProgress } =
    useFileInput();
  const [value, setValue] = useState(filename || "");

  const { setAlert } = useAlert();

  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files![0];
    if (!file) return;
    setLoading(true);
    onUploadStart?.(file);

    if (!raw) {
      await new Promise((resolve) => {
        setTimeout(() => {
          setLoading(false);
          setScanning(true);
          resolve(true);
        }, 2000);
      });
      try {
        const res = await uploadFile(file);

        await new Promise((resolve) => {
          let currentProgress = 0;
          const interval = setInterval(() => {
            if (currentProgress >= 100) {
              setScanning(false);
              setLoading(false);
              setProgress(0);
              currentProgress = 0;
              clearInterval(interval);
              resolve(true);
            }
            currentProgress += 10;
            setProgress(currentProgress);
          }, 100);
        });

        onSuccess?.(res.data.data);
        setValue(res.data.data.filename);
      } catch (err: any) {
        setAlert({
          title: "Failed uploading file",
          message: err?.response?.data?.message,
          status: "error",
        });
      } finally {
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
          <div className="absolute left-4 w-[93%]">
            <ScanAnimation />
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
        {!scanning && (value || props.placeholder)}
      </div>
    </div>
  );
};

export default FileInput;

type ScanAnimationProps = {
  isVertical?: boolean;
};

export const ScanAnimation = ({ isVertical }: ScanAnimationProps) => {
  const { progress } = useFileInput();
  return (
    <div
      className={classNames(
        "flex w-full items-center justify-between gap-4",
        isVertical && "flex-col"
      )}
    >
      {progress >= 100 ? (
        "Scanning complete"
      ) : (
        <span className="text-white/50">
          Scanning for virus
          <AnimatedEllipsis />
        </span>
      )}
      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-gray-600/50">
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
    </div>
  );
};

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

type UseFileInput = {
  loading: boolean;
  setLoading: (val: boolean) => void;
  scanning: boolean;
  setScanning: (val: boolean) => void;
  progress: number;
  setProgress: (val: number) => void;
};

const useFileInput = create<UseFileInput>((set) => ({
  loading: false,
  setLoading: (loading: boolean) => set((state) => ({ ...state, loading })),
  scanning: false,
  setScanning: (scanning: boolean) => set((state) => ({ ...state, scanning })),
  progress: 0,
  setProgress: (progress: number) => set((state) => ({ ...state, progress })),
}));
