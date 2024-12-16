import { TextFieldProps } from "@mui/material";
import { uploadFile } from "api/upload";
import classNames from "classnames";
import { ChangeEvent, useState } from "react";

import loader from "assets/images/icons/loader.svg";
import upload from "assets/images/icons/upload.svg";

import { File } from "lib/types/common";

import Input from "./input";

type IProps = TextFieldProps & {
  filename?: string;

  onUploadStart?: () => void;

  onUploadEnd?: () => void;

  onSuccess?: (data: File) => void;
};

const FileInput = ({
  filename,

  onSuccess,

  onUploadStart,

  onUploadEnd,

  ...props
}: IProps) => {
  const [loading, setLoading] = useState(false);

  const [value, setValue] = useState(filename || "");

  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    setLoading(true);

    onUploadStart?.();

    try {
      const res = await uploadFile(e.target.files![0]);

      onSuccess?.(res.data.data);

      setValue(res.data.data.filename);
    } catch (err) {
      console.log(err);
    } finally {
      onUploadEnd?.();
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full cursor-pointer">
      <Input
        color="primary"
        type="file"
        {...props}
        disabled={loading}
        onChange={handleUpload}
        className="absolute left-0 top-0 z-10 cursor-pointer"
        error={props.error}
        helperText={props.helperText}
      />

      {loading ? (
        <img
          src={loader}
          alt="loader"
          className="absolute right-3 top-3.5 w-6 animate-spin"
        />
      ) : (
        <img
          src={upload}
          alt="upload"
          className="absolute right-4 top-4 h-[18px] w-4"
        />
      )}

      <div
        className={classNames(
          "pointer-events-none absolute left-4 top-3.5",
          value ? "text-white" : "text-white/50"
        )}
      >
        {loading ? "Uploading..." : value || props.placeholder}
      </div>
    </div>
  );
};

export default FileInput;
