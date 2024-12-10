import { TextFieldProps } from "@mui/material";
import upload from "../../assets/images/icons/upload.svg";
import loader from "../../assets/images/icons/loader.svg";
import Input from "./input";
import { ChangeEvent, useState } from "react";
import { uploadFile } from "../../api/upload";

type ReturnType = {
  id: number;

  filename: string;

  key: string;

  fileUrl: string;

  createdAt: string;
};

type IProps = TextFieldProps & {
  onSuccess?: (data: ReturnType) => void;
};

const FileInput = ({ onSuccess, ...props }: IProps) => {
  const [loading, setLoading] = useState(false);

  const [value, setValue] = useState("");
  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    setLoading(true);

    try {
      const res = await uploadFile(e.target.files![0]);

      onSuccess?.(res.data.data);

      setValue(res.data.data.fileName);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <Input
        color="primary"
        type="file"
        {...props}
        disabled={loading}
        onChange={handleUpload}
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

      <div className="absolute left-4 top-4 text-gray-500 text-sm">
        {loading ? "Uploading..." : value || props.placeholder}
      </div>
    </div>
  );
};

export default FileInput;
