"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { BsPencilSquare as Update } from "react-icons/bs";
import { LuDownload as Download } from "react-icons/lu";
import { TbFileExport as Export } from "react-icons/tb";

import { cn } from "lib/utils";

interface SelectionToolbarProps {
  selectedCount: number;
  onDelete: () => void;
  onEdit: () => void;
  onDownload: () => void;
  onExport: () => void;
}

export function Toolbar({
  selectedCount,
  onDelete,
  onEdit,
  onDownload,
  onExport,
}: SelectionToolbarProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <AnimatePresence>
      {selectedCount > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="m,max-w-full fixed bottom-0 left-0 right-0 z-40 mx-auto flex items-center justify-between gap-4 bg-neutral-800 px-4 py-4 shadow-lg md:my-6 md:max-w-screen-sm md:rounded-3 md:px-6"
        >
          <div className="flex items-center gap-4">
            <button onClick={() => onDelete()} className="group">
              <X className="h-4 w-4 transition group-hover:stroke-mint" />
              <span className="sr-only">Clear selection</span>
            </button>
            <div className="flex items-end gap-x-1.5 text-sm">
              <span className="rounded bg-white px-1.5 py-0.5 text-sm font-medium text-neutral-800">
                {selectedCount}
              </span>
              <span className="">selected</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="group flex items-center gap-2 text-sm transition hover:text-mint"
              onClick={onEdit}
            >
              <Update
                className={cn(
                  "transition-all group-hover:fill-mint group-hover:stroke-mint"
                )}
              />
              Update status
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="group flex items-center gap-2 text-sm transition hover:text-mint"
              onClick={onDownload}
            >
              <Download
                className={cn("transition-all group-hover:stroke-mint")}
              />
              Download Evidence
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="group flex items-center gap-2 text-sm transition hover:text-mint"
              onClick={onExport}
            >
              <Export
                className={cn("transition-all group-hover:stroke-mint")}
              />
              Export CSV
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
