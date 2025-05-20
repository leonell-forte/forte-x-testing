import { useEffect } from "react";
import { create } from "zustand";

import FileUpload from "components/Dashboard/Beneficiaries/BulkUpload/FileUpload";
import FixErrors from "components/Dashboard/Beneficiaries/BulkUpload/FixErrors";
import ImportStep from "components/Dashboard/Beneficiaries/BulkUpload/ImportStep";
import {
  StepContent,
  StepTrigger,
  Stepper,
} from "components/ui/stepper/Stepper";

export interface CsvData {
  headers: string[];
  rows: any[][];
}

type TBulkUploadStore = {
  step: number;
  setStep: (step: number) => void;
  data: CsvData;
  setData: (data: CsvData) => void;
  csvFile: File | null;
  setCsvFile: (file: File | null) => void;
  isOverwriteByEmailEnabled: boolean;
  setIsOverwriteByEmailEnabled: (value: boolean) => void;
  originalFileName: string;
  setOriginalFileName: (fileName: string) => void;
};

export const useBulkUploadStore = create<TBulkUploadStore>()((set) => ({
  step: 1,
  setStep: (step: number) => set(() => ({ step })),
  data: { headers: [], rows: [] },
  setData: (data: CsvData) => set(() => ({ data })),
  csvFile: null,
  setCsvFile: (file: File | null) => set(() => ({ csvFile: file })),
  isOverwriteByEmailEnabled: false,
  setIsOverwriteByEmailEnabled: (value: boolean) =>
    set(() => ({ isOverwriteByEmailEnabled: value })),
  originalFileName: "",
  setOriginalFileName: (fileName: string) =>
    set(() => ({ originalFileName: fileName })),
}));

const BulkUpload = () => {
  const { step, setStep, setData, setCsvFile } = useBulkUploadStore();

  useEffect(() => {
    return () => {
      setStep(1);
      setData({ headers: [], rows: [] });
      setCsvFile(null);
    };
  }, [setStep, setData, setCsvFile]);

  return (
    <div>
      <p className="mb-6 text-2xl font-semibold">Bulk Upload</p>
      <Stepper activeStep={step}>
        <div className="mx-auto flex w-full max-w-screen-md flex-wrap">
          <StepTrigger stepNumber={1}>1. File Upload</StepTrigger>
          <StepTrigger stepNumber={2}>2. Fix Errors</StepTrigger>
          <StepTrigger stepNumber={3}>3. Import</StepTrigger>
        </div>

        <StepContent contentNumber={1}>
          <div className="pt-6">
            <FileUpload />
          </div>
        </StepContent>

        <StepContent contentNumber={2}>
          <div className="pt-6">
            <FixErrors />
          </div>
        </StepContent>

        <StepContent contentNumber={3}>
          <div className="pt-6">
            <ImportStep />
          </div>
        </StepContent>
      </Stepper>
    </div>
  );
};

export default BulkUpload;
