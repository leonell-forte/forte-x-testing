import { LuDownload as Download } from "react-icons/lu";

import formatToInternational from "@/lib/isPhoneValid";
import { excelDateToFormattedDate } from "@/lib/validators/csv";

import Button from "@/components/ui/button";
import FileUploader from "@/components/ui/file-uploader/FileUploader";

import { useBulkUploadStore } from "@/pages/Beneficiaries/BulkUpload";

const FileUpload = () => {
  const { setData, data, setStep } = useBulkUploadStore();

  const handleFileUpload = (jsonData: any[][]): void => {
    const headers = jsonData[0] as string[];
    const rows = jsonData.slice(1).map((row) =>
      row.map((cell, colIndex) => {
        const columnName = headers[colIndex];
        if (
          ["start date", "end date", "date of birth"].includes(
            columnName.toLowerCase()
          )
        ) {
          return excelDateToFormattedDate(cell);
        }
        if (columnName.toLowerCase() === "phone number") {
          return formatToInternational(cell);
        }
        return cell;
      })
    );
    const newData = { headers, rows };

    setData(newData);
  };

  return (
    <div className="space-y-[40px]">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xl font-semibold">Download CSV Template</p>
            <p>
              Download the template and input data following the proper columns
              and rules stated within the file.
            </p>
          </div>
          <button className="group h-12 w-full max-w-[250px] rounded-full border border-mint transition duration-500 hover:border-white">
            <a
              href="/beneficiaries-template.csv"
              download="Import Beneficiaries Template.csv"
              className="flex w-full items-center justify-center gap-2"
            >
              <Download className="stroke-mint transition duration-500 group-hover:stroke-white" />
              <p className="text-mint transition duration-500 group-hover:text-white">
                Download CSV Template
              </p>
            </a>
          </button>
        </div>
        <div>
          <div className="space-y-2">
            <p>Your CSV must include the following columns:</p>
            <div className="grid max-w-screen-md grid-cols-[125px_1fr] gap-8">
              <div>
                <p>Required:</p>
                <ul className="list-disc pl-6">
                  <li>First name</li>

                  <li>Last name</li>

                  <li>Contract ID</li>

                  <li>Email</li>
                </ul>
              </div>
              <div>
                <p>Optional:</p>

                <ul className="list-disc pl-6">
                  <li>Cohort (Start date, End date, and Program)</li>

                  <li>Social media (LinkedIn, Github, and Other)</li>

                  <li>
                    Demographics (Date of birth, Ethnicity, Gender, Disability
                    status, Address, Socio-economic status, Highest education
                    level, and Language(s) spoken)
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full space-y-2">
        <div className="space-y-1">
          <p className="text-xl font-semibold">Upload populated CSV file</p>
          <p>Save the populated file as a CSV file and upload it here.</p>
        </div>
        <FileUploader onFileUpload={handleFileUpload} />
      </div>
      <div className="flex justify-end">
        {data.headers.length > 0 && (
          <Button className="w-[147px]" onClick={() => setStep(2)}>
            Next
          </Button>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
