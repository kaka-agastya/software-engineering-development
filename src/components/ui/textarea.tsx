import * as React from "react";
import { cn } from "cn";

/**
 * Komponen input area teks multilini dengan styling tema visual LIVIA.
 */
function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex min-h-30 w-full rounded-2xl border border-line bg-white px-4 py-3 text-base text-ink placeholder:text-muted focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive outline-none md:text-sm",
        className
      )}
      {...props}
    />
  );
}

export { Textarea };
