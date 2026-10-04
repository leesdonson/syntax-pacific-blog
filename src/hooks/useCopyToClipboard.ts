import { useCallback, useEffect, useRef, useState } from "react";

interface UseCopyToClipboardReturn {
  readonly copied: boolean;
  readonly error: string | null;
  readonly copy: (text: string) => Promise<boolean>;
}

/**
 * Clipboard writer with an auto-resetting "copied" flag and a
 * `document.execCommand` fallback for non-secure contexts.
 */
export function useCopyToClipboard(
  resetAfterMs = 2000,
): UseCopyToClipboardReturn {
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  const copy = useCallback(
    async (text: string): Promise<boolean> => {
      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(text);
        } else {
          const area = document.createElement("textarea");
          area.value = text;
          area.setAttribute("readonly", "");
          area.style.position = "fixed";
          area.style.opacity = "0";
          document.body.appendChild(area);
          area.select();
          document.execCommand("copy");
          document.body.removeChild(area);
        }

        setError(null);
        setCopied(true);
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => setCopied(false), resetAfterMs);
        return true;
      } catch (cause) {
        setError(cause instanceof Error ? cause.message : "Copy failed");
        setCopied(false);
        return false;
      }
    },
    [resetAfterMs],
  );

  return { copied, error, copy };
}
