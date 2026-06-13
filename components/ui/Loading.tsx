import { cn } from "@/lib/utils";

// ── Spinner ────────────────────────────────────────────────────────
interface SpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const spinnerSizes = {
  sm: "w-4 h-4 border-2",
  md: "w-6 h-6 border-2",
  lg: "w-10 h-10 border-3",
  xl: "w-14 h-14 border-4",
};

export function Spinner({ size = "md", className }: SpinnerProps) {
  return (
    <div
      className={cn(
        "rounded-full border-primary-200 dark:border-primary-800 border-t-primary-600 dark:border-t-primary-400 animate-spin",
        spinnerSizes[size],
        className
      )}
    />
  );
}

// ── Full Page Loading ──────────────────────────────────────────────
export function PageLoading({ message = "লোড হচ্ছে..." }: { message?: string }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-50 dark:bg-slate-900">
      <div className="w-16 h-16 gradient-bg rounded-2xl flex items-center justify-center shadow-xl animate-pulse">
        <span className="text-2xl">⚗️</span>
      </div>
      <Spinner size="lg" />
      <p className="text-slate-500 dark:text-slate-400 text-sm">{message}</p>
    </div>
  );
}

// ── Inline Loading ─────────────────────────────────────────────────
export function InlineLoading({ message = "লোড হচ্ছে..." }: { message?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 py-12">
      <Spinner size="md" />
      <span className="text-slate-500 dark:text-slate-400 text-sm">{message}</span>
    </div>
  );
}

// ── Skeleton ───────────────────────────────────────────────────────
interface SkeletonProps {
  className?: string;
  rounded?: "sm" | "md" | "lg" | "full";
}

export function Skeleton({ className, rounded = "md" }: SkeletonProps) {
  const roundedClass = {
    sm:   "rounded",
    md:   "rounded-xl",
    lg:   "rounded-2xl",
    full: "rounded-full",
  }[rounded];

  return (
    <div
      className={cn(
        "animate-pulse bg-slate-200 dark:bg-slate-700",
        roundedClass,
        className
      )}
    />
  );
}

// ── Card Skeleton ──────────────────────────────────────────────────
export function CardSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 space-y-4">
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
      <div className="flex gap-2 pt-2">
        <Skeleton className="h-6 w-16" rounded="full" />
        <Skeleton className="h-6 w-20" rounded="full" />
      </div>
    </div>
  );
}

// ── Topic Card Skeleton ────────────────────────────────────────────
export function TopicCardSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-4 w-4" rounded="full" />
      </div>
      <Skeleton className="h-6 w-4/5" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <div className="flex items-center justify-between pt-1">
        <div className="flex gap-2">
          <Skeleton className="h-5 w-16" rounded="full" />
          <Skeleton className="h-5 w-20" rounded="full" />
        </div>
        <Skeleton className="h-4 w-4" />
      </div>
    </div>
  );
}

// ── Grid of Card Skeletons ─────────────────────────────────────────
export function CardGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

// ── Formula Skeleton ───────────────────────────────────────────────
export function FormulaSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 space-y-3">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-5 w-1/2" />
      <Skeleton className="h-12 w-full" rounded="lg" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  );
}

// ── Table Skeleton ─────────────────────────────────────────────────
export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-4 gap-4 p-4 border-b border-slate-200 dark:border-slate-700">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-4" />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="grid grid-cols-4 gap-4 p-4 border-b border-slate-100 dark:border-slate-700/50 last:border-0">
          {Array.from({ length: 4 }).map((_, j) => (
            <Skeleton key={j} className="h-4" />
          ))}
        </div>
      ))}
    </div>
  );
}
