import { useMemo } from "react";
import katex from "katex";
import { cn } from "@/lib/utils";

type MathExprProps = {
  tex: string;
  /** Block (display) math, centered */
  block?: boolean;
  className?: string;
};

export function MathExpr({ tex, block, className }: MathExprProps) {
  const html = useMemo(
    () =>
      katex.renderToString(tex, {
        displayMode: Boolean(block),
        throwOnError: false,
        strict: "ignore",
      }),
    [tex, block]
  );

  if (block) {
    return (
      <div
        className={cn("overflow-x-auto py-2 text-center [&_.katex]:text-base md:[&_.katex]:text-lg", className)}
        dangerouslySetInnerHTML={{ __html: html }}
      />
    );
  }

  return (
    <span
      className={cn("inline-block align-middle [&_.katex]:text-[0.95em]", className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
