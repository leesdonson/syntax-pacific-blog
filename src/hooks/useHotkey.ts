import { useEffect } from "react";

type Handler = (event: KeyboardEvent) => void;

/**
 * Global keyboard shortcut binding. `combo` examples: "k" with meta, "Escape".
 * Ignores keystrokes originating in inputs unless `allowInInput` is set.
 */
export function useHotkey(
  key: string,
  handler: Handler,
  options: { readonly meta?: boolean; readonly allowInInput?: boolean } = {},
): void {
  const { meta = false, allowInInput = false } = options;

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== key.toLowerCase()) return;
      if (meta && !(event.metaKey || event.ctrlKey)) return;
      if (!meta && (event.metaKey || event.ctrlKey)) return;

      const target = event.target as HTMLElement | null;
      const inField = Boolean(
        target?.closest('input, textarea, [contenteditable="true"]'),
      );
      if (inField && !allowInInput) return;

      handler(event);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [key, handler, meta, allowInInput]);
}
