"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, XCircle, X } from "lucide-react";

export type ToastState = {
  type: "success" | "error";
  message: string;
} | null;

interface ToastProps {
  toast: ToastState;
  onClose: () => void;
}

/**
 * Fixed bottom-right toast for surfacing save success / failure
 * from admin forms. Use together with the `useToast` hook below.
 */
export function Toast({ toast, onClose }: ToastProps) {
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          className={`fixed bottom-5 right-5 left-5 sm:left-auto z-[100] flex items-start gap-3 px-4 py-3.5 rounded-2xl shadow-2xl border max-w-sm ${
            toast?.type === "success"
              ? "bg-emerald-950/95 border-emerald-700 text-emerald-200"
              : "bg-red-950/95 border-red-700 text-red-200"
          }`}
        >
          {toast?.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
          ) : (
            <XCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          )}
          <p className="text-sm flex-1">{toast?.message}</p>
          <button onClick={onClose} className="flex-shrink-0 opacity-70 hover:opacity-100">
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
