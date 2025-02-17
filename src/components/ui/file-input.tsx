import { TextFieldProps } from "@mui/material";
import { uploadFile } from "api/upload";
import classNames from "classnames";
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

  const [value, setValue] = useState(filename || "");

  const { setAlert } = useAlert();

  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    setLoading(true);

    const file = e.target.files![0];

    onUploadStart?.(file);

    if (!raw) {
      try {
        const res = await uploadFile(file);

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
        setLoading(false);
      }
    } else {
      setValue(file.name);
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full cursor-pointer">
      <Input
        color="primary"
        type="file"
        accept={accept}
        {...props}
        disabled={loading || props.disabled}
        onChange={handleUpload}
        className="absolute left-0 top-0 z-10 cursor-pointer"
      />

      {loading ? (
        <img
          src={loader}
          alt="loader"
          className="absolute right-4 top-[15px] w-4 animate-spin"
        />
      ) : (
        <img
          src={upload}
          alt="upload"
          className="absolute right-4 top-[15px] w-3.5"
        />
      )}

      <div
        className={classNames(
          "pointer-events-none absolute left-4 top-3.5 text-sm",
          value ? "text-white" : "text-white/50"
        )}
      >
        {loading ? "Uploading..." : value || props.placeholder}
      </div>
    </div>
  );
};

export default FileInput;
