"use client";

import { useCallback, useState } from "react";
import { ToastState } from "@/components/ui/Toast";

/**
 * Minimal toast-state hook. Auto-dismisses after `duration` ms.
 *
 * Usage:
 *   const { toast, showToast, hideToast } = useToast();
 *   showToast("success", "টপিক সংরক্ষিত হয়েছে");
 *   <Toast toast={toast} onClose={hideToast} />
 */
export function useToast(duration = 3500) {
  const [toast, setToast] = useState<ToastState>(null);

  const showToast = useCallback(
    (type: "success" | "error", message: string) => {
      setToast({ type, message });
      window.setTimeout(() => setToast(null), duration);
    },
    [duration]
  );

  const hideToast = useCallback(() => setToast(null), []);

  return { toast, showToast, hideToast };
}
