import evidenceService from "api/evidence";
import { useState } from "react";

import { ReactComponent as Download } from "assets/images/icons/download.svg";
import loader from "assets/images/icons/loader.svg";
import { ReactComponent as ZoomIn } from "assets/images/icons/zoom-in.svg";
import { ReactComponent as ZoomOut } from "assets/images/icons/zoom-out.svg";

import { File } from "lib/types/common";

import Spinner from "components/ui/spinner/spinner";

const Evidence = ({
  file,
  fileData,
  loading,
}: {
  file: File;
  fileData: string;
  loading: boolean;
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);

  const handleZoomIn = () => {
    setZoomLevel((prevZoom) => Math.min(prevZoom + 0.25, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel((prevZoom) => Math.max(prevZoom - 0.25, 0.5));
  };
  return (
    <>
      {!loading && fileData ? (
        <div className="mx-auto flex flex-col items-center py-6">
          <div className="flex h-[calc(100vh-550px)] w-full max-w-[500px] items-center justify-center overflow-x-auto md:h-[calc(100vh-550px)]">
            {fileData && (
              <div className="flex h-full flex-col">
                <div className="flex h-10 w-full items-center justify-end gap-3 rounded-t-[16px] bg-neutral-800 px-5">
                  <button
                    onClick={handleZoomIn}
                    aria-label="Zoom in"
                    className="transition-opacity hover:opacity-80"
                  >
                    <ZoomIn className="w-4 fill-neutral-400" />
                  </button>
                  <button
                    onClick={handleZoomOut}
                    aria-label="Zoom out"
                    className="transition-opacity hover:opacity-80"
                  >
                    <ZoomOut className="w-4 fill-neutral-400" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      evidenceService.getFile(file.fileUrl, file.filename);
                    }}
                  >
                    <Download className="w-4 stroke-neutral-400" />
                  </button>
                </div>
                <div className="relative h-full w-full bg-neutral-600 px-4 pt-6">
                  <iframe
                    src={fileData + "#navpanes=0&toolbar=0&view=Fit&page=1"}
                    style={{
                      border: "none",
                      background: "transparent",
                      transform: `scale(${zoomLevel})`,
                      transformOrigin: "top center",
                      transition: "transform 0.2s ease",
                    }}
                    width="100%"
                    height="100%"
                    title={file?.filename}
                    className={
                      loading
                        ? "h-full opacity-[.4]"
                        : "hide-scroll w-[700px] max-w-full overflow-x-auto md:w-[42rem]"
                    }
                  />
                </div>
                <div className="flex h-[42px] w-full items-center bg-neutral-200 px-4">
                  <span className="font-light text-neutral-500">
                    {file?.filename}
                  </span>
                </div>
              </div>
            )}

            {loading && (
              <>
                <img
                  src={loader}
                  alt=""
                  className="absolute w-10 animate-spin"
                />
                <span className="sr-only">Loading file</span>
              </>
            )}
          </div>
        </div>
      ) : null}
      {loading ? (
        <div
          className="flex h-[250px] w-full items-center justify-center"
          aria-hidden="true"
        >
          <Spinner />
          <span className="sr-only">Loading file</span>
        </div>
      ) : null}
    </>
  );
};

export default Evidence;
