import { motion } from "framer-motion";
import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { ReactComponent as Check } from "assets/images/icons/check-award.svg";
import { ReactComponent as Exclamation } from "assets/images/icons/exclamation.svg";

import { useImportBeneficiaryMutation } from "lib/mutations/beneficiaries";

import Button from "components/ui/button";

import { useBulkUploadStore } from "pages/Beneficiaries/BulkUpload";

interface LoopingProgressBarProps {
  className?: string;
  height?: string;
  backgroundColor?: string;
  barColor?: string;
  duration?: number;
}

const LoopingProgressBar: React.FC<LoopingProgressBarProps> = ({
  className,
  height = "h-2",
  backgroundColor = "bg-gray-200",
  barColor = "bg-mint",
  duration = 2,
}) => (
  <div
    className={`relative ${height} w-full overflow-hidden rounded ${backgroundColor} ${className || ""}`}
  >
    <motion.div
      className={`absolute bottom-0 left-0 top-0 w-[30%] rounded ${barColor}`}
      animate={{
        left: ["0%", "130%"],
        x: ["-100%", "0%"],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  </div>
);

function ImportStep() {
  const { setStep } = useBulkUploadStore();
  const navigate = useNavigate();
  const { csvFile, isOverwriteByEmailEnabled } = useBulkUploadStore();
  const [isSuccess, setIsSuccess] = useState(false);
  const { importBeneficiaries: beneficiariesImport, isPending } =
    useImportBeneficiaryMutation({
      successCallback: () => setIsSuccess(true),
      errorCallback: () => setIsSuccess(false),
    });

  useEffect(() => {
    if (csvFile)
      beneficiariesImport({ isOverwriteByEmailEnabled, file: csvFile });
  }, [csvFile, isOverwriteByEmailEnabled, beneficiariesImport]);

  return (
    <div>
      <p className="mb-[100px] text-xl font-semibold">
        Importing Beneficiaries
      </p>
      {isPending ? (
        <div
          className="mx-auto flex h-[100px] w-full max-w-screen-sm flex-col items-center justify-center gap-4"
          role="status"
          aria-live="polite"
        >
          <LoopingProgressBar />
          <p className="animate-pulse text-lg">Importing file...</p>
        </div>
      ) : (
        <div className="flex w-full flex-col items-center justify-center">
          {isSuccess ? (
            <>
              <Check />
              <p className="mb-2 mt-4 text-2xl font-semibold">
                File successfully uploaded.
              </p>
              <p className="mb-6 text-xl">
                You will receive an email notification once the data importing
                is complete.
              </p>
              <Button
                onClick={() => {
                  navigate("/beneficiaries");
                }}
              >
                Go to beneficiaries page
              </Button>
            </>
          ) : (
            <>
              <Exclamation />
              <p className="mb-2 mt-4 text-2xl font-semibold">
                File upload failed.
              </p>
              <p className="mb-6 text-xl">
                Please try again or contact support.
              </p>
              <Button
                onClick={() => {
                  setStep(1);
                }}
              >
                Back to file upload
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default ImportStep;
