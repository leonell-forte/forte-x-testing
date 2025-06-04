"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import React, { useEffect, useState } from "react";

interface SelectionToolbarProps {
  selectedCount: number;
  onDelete: () => void;
  actions: {
    label: string;
    onClick: () => void;
    icon: React.ReactNode;
  }[];
}

export function Toolbar({
  selectedCount,
  onDelete,
  actions,
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
          className="fixed bottom-0 left-0 right-0 z-40 mx-auto flex w-fit items-center justify-between gap-6 bg-neutral-800 px-4 py-4 shadow-lg md:my-6 md:rounded-3 md:px-6"
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
          {actions.map((action, index) => (
            <div className="flex items-center gap-2" key={index}>
              <button
                type="button"
                className="group flex items-center gap-2 text-sm transition hover:text-mint"
                onClick={action.onClick}
              >
                {action.icon}
                {action.label}
              </button>
            </div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
