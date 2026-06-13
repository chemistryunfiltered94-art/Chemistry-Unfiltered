import { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full font-medium transition-colors",
  {
    variants: {
      variant: {
        default:     "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400",
        secondary:   "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300",
        success:     "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
        warning:     "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400",
        danger:      "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400",
        info:        "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
        purple:      "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400",
        gradient:    "gradient-bg text-white shadow-sm",
      },
      size: {
        sm: "px-2 py-0.5 text-xs",
        md: "px-2.5 py-1 text-xs",
        lg: "px-3 py-1.5 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

const levelVariants: Record<string, string> = {
  beginner:     "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
  intermediate: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
  advanced:     "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400",
};

const levelLabels: Record<string, string> = {
  beginner:     "শুরু",
  intermediate: "মধ্যবর্তী",
  advanced:     "উন্নত",
};

interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

function Badge({ className, variant, size, dot, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant, size }), className)} {...props}>
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}

function LevelBadge({ level }: { level: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium", levelVariants[level] || levelVariants.beginner)}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {levelLabels[level] || level}
    </span>
  );
}

export { Badge, LevelBadge, badgeVariants };
