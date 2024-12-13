import { TextFieldProps } from "@mui/material";
import upload from "../../assets/images/icons/upload.svg";
import loader from "../../assets/images/icons/loader.svg";
import Input from "./input";
import { ChangeEvent, useState } from "react";
import { uploadFile } from "../../api/upload";
import classNames from "classnames";
import { File } from "../../lib/types/common";

type IProps = TextFieldProps & {
  onUploadStart?: () => void;

  onUploadEnd?: () => void;

  onSuccess?: (data: File) => void;
};

const FileInput = ({
  onSuccess,
  onUploadStart,
  onUploadEnd,
  ...props
}: IProps) => {
  const [loading, setLoading] = useState(false);

  const [value, setValue] = useState("");

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
        className="z-10 absolute top-0 left-0 cursor-pointer"
      />

      {loading ? (
        <img
          src={loader}
          alt="loader"
          className="animate-spin w-6 absolute right-3 top-3.5"
        />
      ) : (
        <img
          src={upload}
          alt="upload"
          className="w-4 h-[18px] absolute right-4 top-4"
        />
      )}

      <div
        className={classNames(
          "absolute left-4 top-3.5 pointer-events-none",
          value ? "text-white" : "text-white/50",
        )}
      >
        {loading ? "Uploading..." : value || props.placeholder}
      </div>
    </div>
  );
};

export default FileInput;
