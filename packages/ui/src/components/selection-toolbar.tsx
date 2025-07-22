import { AnimatePresence, motion } from "framer-motion";
import { Trash, X } from "lucide-react";
import React from "react";

import { cn } from "../lib/utils";
import { Toolbar, ToolbarButton, ToolbarSeparator } from "./toolbar";

interface SelectionToolbarProps {
  selectedCount: number;
  onDelete?: () => void;
  onClear?: () => void;
  actions?: React.ReactNode;
  className?: string;
  position?: "bottom" | "top";
  itemLabel?: string;
  deleteLabel?: string;
  clearLabel?: string;
}

export function SelectionToolbar({
  selectedCount,
  onDelete,
  onClear,
  actions,
  position = "bottom",
  itemLabel = "row",
  deleteLabel = "Delete",
  clearLabel = "Clear",
}: SelectionToolbarProps) {
  const isVisible = selectedCount > 0;

  const positionClasses = {
    bottom: "bottom-0",
    top: "top-0",
  };

  const animationProps = {
    bottom: {
      initial: { y: 80, opacity: 0 },
      animate: { y: 0, opacity: 1 },
      exit: { y: 80, opacity: 0 },
    },
    top: {
      initial: { y: -80, opacity: 0 },
      animate: { y: 0, opacity: 1 },
      exit: { y: -80, opacity: 0 },
    },
  };

  const showDelete = typeof onDelete === "function";
  const showClear = typeof onClear === "function";

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          {...animationProps[position]}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className={cn(
            "fixed",
            positionClasses[position],
            "pointer-events-none left-0 z-50 flex w-full justify-center"
          )}
        >
          <div className="pointer-events-auto mx-auto mb-6 w-fit min-w-64 max-w-4xl px-4">
            <Toolbar className="space-x-12 py-4">
              {/* Selection Count */}
              <div className="flex items-center gap-2 text-sm font-medium">
                <span className="bg-primary text-primary-foreground rounded-full border px-2.5 py-1 text-center font-semibold">
                  {selectedCount}
                </span>
                <span>
                  {itemLabel}
                  {selectedCount > 1 ? "s" : ""} selected
                </span>
              </div>
              {/* Actions */}
              <div className="flex items-center gap-6">
                {/* Custom Actions */}
                {actions}

                {/* Separator if there are custom actions */}
                {actions && (showClear || showDelete) && <ToolbarSeparator />}

                {/* Delete Button */}
                {showDelete && (
                  <ToolbarButton
                    onClick={onDelete}
                    aria-label={deleteLabel}
                    disabled={selectedCount <= 1}
                  >
                    <Trash />
                    {deleteLabel}
                  </ToolbarButton>
                )}

                {/* Clear Button */}
                {showClear && (
                  <ToolbarButton onClick={onClear} aria-label={clearLabel}>
                    <X />

                    {clearLabel}
                  </ToolbarButton>
                )}
              </div>
            </Toolbar>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
