import { useEffect, useState } from "react";
import { AiFillCloseCircle as X } from "react-icons/ai";
import { HiCheckCircle, HiExclamationCircle } from "react-icons/hi2";
import { MdClose as Close } from "react-icons/md";
import * as XLSX from "xlsx";

import { ReactComponent as Exclamation } from "assets/images/icons/exclamation.svg";

import { usePage } from "lib/hooks";
import { formatDate } from "lib/utils";
import { selectOptions, validateField } from "lib/validators/csv";

import { useCustomPrompt } from "components/ui/alert/custom-prompt";
import Button from "components/ui/button";
import Checkbox from "components/ui/checkbox";
import Input from "components/ui/input";
import Pagination from "components/ui/pagination";
import { ScrollArea, ScrollBar } from "components/ui/scroll-area/ScrollArea";
import { Switch } from "components/ui/switch/Switch";
import Table from "components/ui/table";
import { Tooltip } from "components/ui/tooltip/Tooltip";

import { CsvData, useBulkUploadStore } from "pages/Beneficiaries/BulkUpload";

interface ValidationError {
  rowIndex: number;
  colIndex: number;
  message: string;
}

const FixErrors = () => {
  const {
    data,
    setData,
    setStep,
    setCsvFile,
    isOverwriteByEmailEnabled,
    setIsOverwriteByEmailEnabled,
  } = useBulkUploadStore();

  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [editingCell, setEditingCell] = useState<{
    rowIndex: number;
    colIndex: number;
    value: string;
  } | null>(null);
  const { page, setPage } = usePage();
  const pageSize: number = 10;

  const validateData = (csvData: CsvData) => {
    const newErrors: ValidationError[] = [];

    csvData.rows.forEach((row, rowIndex) => {
      row.forEach((value, colIndex) => {
        const columnName = csvData.headers[colIndex];
        const errorMessage = validateField(value?.toString() || "", columnName);

        if (errorMessage) {
          newErrors.push({
            rowIndex,
            colIndex,
            message: errorMessage,
          });
        }
      });
    });

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const hasRowErrors = (rowIndex: number) => {
    return errors.some((error) => error.rowIndex === rowIndex);
  };

  const handleCellEdit = (
    rowIndex: number,
    colIndex: number,
    value: string
  ) => {
    const newData = { ...data };
    newData.rows[rowIndex][colIndex] = value;

    setData(newData);

    const errorMessage = validateField(value, data.headers[colIndex]);
    if (errorMessage) {
      setErrors((prev) => [
        ...prev.filter(
          (e) => !(e.rowIndex === rowIndex && e.colIndex === colIndex)
        ),
        { rowIndex, colIndex, message: errorMessage },
      ]);
    } else {
      setErrors((prev) =>
        prev.filter(
          (e) => !(e.rowIndex === rowIndex && e.colIndex === colIndex)
        )
      );
    }
  };

  const getCellError = (rowIndex: number, colIndex: number) => {
    return errors.find(
      (e) => e.rowIndex === rowIndex && e.colIndex === colIndex
    );
  };

  const [showOnlyErrors, setShowOnlyErrors] = useState(false);
  const [bannerOpen, setBannerOpen] = useState(true); // NEW

  const errorRowIndices = Array.from(new Set(errors.map((e) => e.rowIndex)));

  const filteredRows = showOnlyErrors
    ? data.rows
        .map((row, idx) => ({ row, originalIndex: idx }))
        .filter(({ originalIndex }) => errorRowIndices.includes(originalIndex))
    : data.rows.map((row, idx) => ({ row, originalIndex: idx }));

  const totalRecords: number = filteredRows.length;
  const totalPages: number = Math.ceil(totalRecords / pageSize);
  const startIndex: number = (page - 1) * pageSize;
  const endIndex: number = Math.min(startIndex + pageSize, totalRecords);
  const currentData = filteredRows.slice(startIndex, endIndex);

  const exportToCSV = () => {
    const wb = XLSX.utils.book_new();

    const ws = XLSX.utils.aoa_to_sheet([data.headers, ...data.rows]);

    XLSX.utils.book_append_sheet(wb, ws, "Beneficiaries");

    const timestamp = formatDate(new Date(), "yyyy-MM-dd_HH-mm");
    const fileName = `beneficiaries_bulk_${timestamp}.csv`;

    const wbout = XLSX.write(wb, { bookType: "csv", type: "array" });
    const blob = new Blob([wbout], { type: "text/csv" });

    const file = new File([blob], fileName, { type: "text/csv" });
    setCsvFile(file);
  };

  const { open, close } = useCustomPrompt();

  const onImport = () => {
    const title = isOverwriteByEmailEnabled
      ? "Overwrite duplicate beneficiaries?"
      : "Ignore beneficiaries with duplicate emails?";
    const subText = isOverwriteByEmailEnabled
      ? "Beneficiaries with matching emails will be overwritten during import."
      : "Beneficiaries with existing emails in the system will not be imported.";
    const yesLabel = isOverwriteByEmailEnabled ? "Overwrite" : "Ignore";
    open({
      title,
      subText,
      yesLabel,
      onYes: () => {
        exportToCSV();
        setStep(3);
        close();
      },
    });
  };

  const isEmpty = data.rows.every((subArr) =>
    subArr.every((str) => str === "")
  );

  useEffect(() => {
    if (errors.length > 0) setBannerOpen(true);
  }, [errors]);

  useEffect(() => {
    validateData(data);
    return () => {
      setPage(1);
    };
  }, [data, setPage]);

  return (
    <div className="">
      <div className="space-y-1">
        <p className="text-xl font-semibold">Check column values</p>
        <p>Click directly on the cells to fix errors or edit values</p>
      </div>

      {/* banner */}

      {isEmpty ? (
        <div className="mt-[100px] flex w-full flex-col items-center justify-center">
          <Exclamation />
          <p className="mb-2 mt-4 text-2xl font-semibold">
            File uploaded is empty.
          </p>
          <p className="mb-6 text-xl">
            The CSV file you have uploaded has no content. Please go back and
            re-upload a file.
          </p>
          <Button
            onClick={() => {
              setStep(1);
            }}
          >
            Back to file upload
          </Button>
        </div>
      ) : (
        <>
          {bannerOpen && (
            <>
              {errorRowIndices.length > 0 && (
                <div
                  className={`mt-6 rounded-md border border-red-200 bg-red-50 px-3 py-2 transition-all duration-300 ease-in-out ${
                    bannerOpen
                      ? "translate-y-0 opacity-100"
                      : "-translate-y-2 opacity-0"
                  }`}
                >
                  <div className="flex h-[30px] items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <X className="fill-red-500" />
                      <p className="font-medium text-red-500">
                        {errorRowIndices.length} row
                        {errorRowIndices.length === 1 ? "" : "s"} contain
                        {errorRowIndices.length === 1 ? "s" : ""} errors.
                      </p>
                      {!showOnlyErrors && (
                        <button
                          type="button"
                          onClick={() => setShowOnlyErrors(true)}
                          className="rounded-full border border-red-200 bg-red-50 px-4 py-1 text-sm font-medium text-red-500 transition-all duration-300 ease-in-out hover:bg-red-100"
                        >
                          View
                        </button>
                      )}
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <button
                        aria-label="Close"
                        className="group"
                        onClick={() => setBannerOpen(false)}
                      >
                        <Close className="fill-red text-lg leading-none transition group-hover:fill-red-700" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {errors.length === 0 && (
                <div
                  className={`mt-6 rounded-md border border-green-200 bg-pastel-green px-3 py-2 transition-all duration-300 ease-in-out ${
                    bannerOpen
                      ? "translate-y-0 opacity-100"
                      : "-translate-y-2 opacity-0"
                  }`}
                >
                  <div className="flex h-[30px] items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <HiCheckCircle className="h-5 w-5 fill-green-700" />
                      <p className="font-medium text-green-700">
                        All rows are valid!
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      <button
                        aria-label="Close"
                        className="group"
                        onClick={() => setBannerOpen(false)}
                      >
                        <Close className="fill-green-700 text-lg leading-none transition group-hover:fill-green-900" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* banner */}

          {showOnlyErrors && filteredRows.length === 0 ? (
            <div className="mt-4 flex min-h-[250px] items-center justify-center rounded-3 border text-center font-semibold">
              No data to be displayed
            </div>
          ) : (
            data.rows.length > 0 && (
              <div className="mt-4">
                <ScrollArea className="hidden w-[calc(100vw-360px)] overflow-hidden lg:block">
                  <Table.Container className="rounded-3 border">
                    <Table.Head>
                      <Table.Row>
                        <Table.Header className="w-12">{""}</Table.Header>
                        {data.headers.map((header, index) => (
                          <Table.Header key={index}>{header}</Table.Header>
                        ))}
                      </Table.Row>
                    </Table.Head>
                    <Table.Body>
                      {currentData.map(({ row, originalIndex }, rowIndex) => {
                        const isLastIndex = rowIndex === currentData.length - 1;

                        return (
                          <Table.Row key={rowIndex}>
                            <Table.Data
                              className="w-20 text-center"
                              cellClassName={isLastIndex ? "border-b-0" : ""}
                            >
                              {hasRowErrors(originalIndex) ? (
                                <span className="font-bold text-red-500">
                                  {" "}
                                  <HiExclamationCircle className="h-auto w-8 fill-red" />
                                </span>
                              ) : (
                                <span className="text-green-500">
                                  <HiCheckCircle className="h-auto w-8" />
                                </span>
                              )}
                            </Table.Data>
                            {data.headers.map((header, colIndex) => {
                              const error = getCellError(
                                originalIndex,
                                colIndex
                              );
                              const isEditing =
                                editingCell?.rowIndex === originalIndex &&
                                editingCell?.colIndex === colIndex;
                              const cellValue = row[colIndex]?.toString() || "";

                              const columnOptions =
                                selectOptions[header.toLowerCase()];

                              return (
                                <Table.Data
                                  key={colIndex}
                                  className={`relative ${error ? "bg-red-700" : ""}`}
                                  cellClassName={
                                    isLastIndex ? "border-b-0" : ""
                                  }
                                >
                                  <Tooltip
                                    title={error?.message}
                                    placement="top"
                                    arrow={false}
                                    {...(!error?.message && { show: false })}
                                  >
                                    <div className="min-w-[150px]">
                                      {isEditing && columnOptions ? (
                                        <select
                                          className="w-full rounded-3 border border-white bg-transparent p-2.5 outline-none"
                                          value={editingCell.value}
                                          onChange={(e) =>
                                            setEditingCell({
                                              ...editingCell,
                                              value: e.target.value,
                                            })
                                          }
                                          onBlur={() => {
                                            handleCellEdit(
                                              originalIndex,
                                              colIndex,
                                              editingCell.value
                                            );
                                            setEditingCell(null);
                                          }}
                                          autoFocus
                                        >
                                          <option
                                            key=""
                                            value=""
                                            className="text-black"
                                            disabled
                                          >
                                            Select an option
                                          </option>
                                          {columnOptions.map((option) => (
                                            <option
                                              key={option}
                                              value={option}
                                              className="text-black"
                                            >
                                              {option}
                                            </option>
                                          ))}
                                        </select>
                                      ) : isEditing ? (
                                        <Input
                                          type={
                                            [
                                              "start date",
                                              "end date",
                                              "date of birth",
                                            ].includes(header.toLowerCase())
                                              ? "date"
                                              : "text"
                                          }
                                          value={
                                            [
                                              "start date",
                                              "end date",
                                              "date of birth",
                                            ].includes(header.toLowerCase())
                                              ? (() => {
                                                  const v = editingCell.value;
                                                  return /^\d{4}-\d{2}-\d{2}$/.test(
                                                    v
                                                  )
                                                    ? v
                                                    : "";
                                                })()
                                              : editingCell.value
                                          }
                                          placeholder={
                                            [
                                              "start date",
                                              "end date",
                                              "date of birth",
                                            ].includes(header.toLowerCase())
                                              ? "yyyy-mm-dd"
                                              : undefined
                                          }
                                          onChange={(e) =>
                                            setEditingCell({
                                              ...editingCell,
                                              value: e.target.value,
                                            })
                                          }
                                          onBlur={() => {
                                            handleCellEdit(
                                              originalIndex,
                                              colIndex,
                                              editingCell.value
                                            );
                                            setEditingCell(null);
                                          }}
                                          onKeyDown={(e) => {
                                            if (e.key === "Enter") {
                                              handleCellEdit(
                                                originalIndex,
                                                colIndex,
                                                editingCell.value
                                              );
                                              setEditingCell(null);
                                            }
                                          }}
                                          autoFocus
                                        />
                                      ) : (
                                        <div
                                          className="flex cursor-pointer items-center p-1 transition hover:text-mint"
                                          onClick={() => {
                                            setEditingCell({
                                              rowIndex: originalIndex,
                                              colIndex,
                                              value: cellValue,
                                            });
                                          }}
                                        >
                                          {cellValue}
                                          {error && (
                                            <div
                                              className={
                                                cellValue === ""
                                                  ? "mx-auto"
                                                  : "ml-2 mr-auto"
                                              }
                                            >
                                              <HiExclamationCircle className="inline-block h-auto w-8 fill-white stroke-red" />
                                            </div>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  </Tooltip>
                                </Table.Data>
                              );
                            })}
                          </Table.Row>
                        );
                      })}
                    </Table.Body>
                  </Table.Container>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </div>
            )
          )}
          <div className="mt-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Switch
                checked={showOnlyErrors}
                onCheckedChange={() => setShowOnlyErrors((v) => !v)}
              />
              Show only rows with errors
            </div>
            <Checkbox
              onChange={(e) => {
                setIsOverwriteByEmailEnabled(e.target.checked);
              }}
              labelClass="text-[14px]"
              label="Overwrite existing beneficiaries with the same email."
            />
          </div>
          <div className="mt-4 flex items-center justify-between">
            <Button
              buttonType="secondary"
              className="w-[147px]"
              onClick={() => setStep(1)}
            >
              Back
            </Button>
            {totalPages > 1 && (
              <Pagination
                page={page}
                onPageChange={(val) => setPage(val)}
                pageSize={pageSize}
                total={totalRecords}
              />
            )}

            <Button
              className="w-[147px]"
              onClick={onImport}
              disabled={errors.length > 0}
            >
              Import
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default FixErrors;
