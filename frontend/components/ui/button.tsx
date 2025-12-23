import clsx from "clsx";
import React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "secondary" | "destructive";
};

export function Button({ className, variant = "default", ...props }: Props) {
  const base =
    "inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium transition disabled:opacity-50 disabled:cursor-not-allowed";
  const styles =
    variant === "destructive"
      ? "bg-red-600 text-white hover:bg-red-700"
      : variant === "secondary"
      ? "bg-zinc-800 text-zinc-100 hover:bg-zinc-700 border border-zinc-700"
      : "bg-zinc-100 text-zinc-900 hover:bg-zinc-200";
  return <button className={clsx(base, styles, className)} {...props} />;
}
