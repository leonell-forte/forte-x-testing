import { TextFieldProps } from "@mui/material";
import upload from "../../assets/images/icons/upload.svg";
import Input from "./input";
import { ChangeEvent } from "react";
import { uploadFile } from "../../api/upload";

type IProps = TextFieldProps & {};

const FileInput = ({ ...props }: IProps) => {
  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    try {
      const res = await uploadFile(e.target.files![0]);

      console.log(res);
    } catch (err) {
      console.log(err);
    } finally {
    }
  };

  return (
    <div className="relative">
      <Input
        color="primary"
        type="file"
        {...props}
        onChange={handleUpload}
      />

      <img
        src={upload}
        alt=""
        className="absolute right-4 top-3.5"
      />
    </div>
  );
};

export default FileInput;
