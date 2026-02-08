import { useState, useRef, useCallback, useEffect } from "react";

const CODE_TO_KEY: Record<string, string> = {
  Space: "Space", Enter: "Enter", Backspace: "Backspace", Tab: "Tab",
  ArrowUp: "Up", ArrowDown: "Down", ArrowLeft: "Left", ArrowRight: "Right",
  Delete: "Delete", Home: "Home", End: "End", PageUp: "PageUp", PageDown: "PageDown",
  Minus: "-", Equal: "=", BracketLeft: "[", BracketRight: "]",
  Backslash: "\\", Semicolon: ";", Quote: "'", Comma: ",", Period: ".", Slash: "/",
  Backquote: "`",
};

for (let i = 65; i <= 90; i++) {
  const ch = String.fromCharCode(i);
  CODE_TO_KEY[`Key${ch}`] = ch;
}
for (let i = 0; i <= 9; i++) CODE_TO_KEY[`Digit${i}`] = String(i);
for (let i = 1; i <= 12; i++) CODE_TO_KEY[`F${i}`] = `F${i}`;

function isModifierCode(code: string): boolean {
  return code.startsWith("Shift") || code.startsWith("Control") ||
         code.startsWith("Alt") || code.startsWith("Meta");
}

const PLATFORM_LABELS: Record<string, string> = {
  Command: "\u2318", Ctrl: "\u2303", Alt: "\u2325", Shift: "\u21E7",
};

function parseAccelerator(accelerator: string): string[] {
  return accelerator.split("+");
}

interface ShortcutRecorderProps {
  label: string;
  hint: string;
  value: string;
  otherValue: string;
  onChange: (accelerator: string) => void;
}

export function ShortcutRecorder({ label, hint, value, otherValue, onChange }: ShortcutRecorderProps) {
  const [recording, setRecording] = useState(false);
  const [previewParts, setPreviewParts] = useState<string[]>([]);
  const [conflict, setConflict] = useState(false);
  const previousValue = useRef(value);
  const fieldRef = useRef<HTMLDivElement>(null);

  const stopRecording = useCallback((cancel: boolean) => {
    setRecording(false);
    setPreviewParts([]);
    if (cancel) onChange(previousValue.current);
    window.voxApi.shortcuts.enable();
  }, [onChange]);

  const startRecording = useCallback(() => {
    previousValue.current = value;
    setRecording(true);
    setPreviewParts([]);
    window.voxApi.shortcuts.disable();
  }, [value]);

  useEffect(() => {
    if (!recording) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (e.code === "Escape") {
        stopRecording(true);
        return;
      }

      const modifiers: string[] = [];
      if (e.metaKey) modifiers.push("Command");
      if (e.ctrlKey) modifiers.push("Ctrl");
      if (e.altKey) modifiers.push("Alt");
      if (e.shiftKey) modifiers.push("Shift");

      if (isModifierCode(e.code)) {
        if (modifiers.length > 0) setPreviewParts(modifiers);
        return;
      }

      const mainKey = CODE_TO_KEY[e.code];
      if (!mainKey || modifiers.length === 0) return;

      const accelerator = [...modifiers, mainKey].join("+");

      if (accelerator === otherValue) {
        setConflict(true);
        setTimeout(() => setConflict(false), 600);
        return;
      }

      onChange(accelerator);
      setRecording(false);
      setPreviewParts([]);
      window.voxApi.shortcuts.enable();
    };

    const handleMouseDown = (e: MouseEvent) => {
      if (fieldRef.current && !fieldRef.current.contains(e.target as Node)) {
        stopRecording(true);
      }
    };

    const handleBlur = () => stopRecording(true);

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("blur", handleBlur);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("blur", handleBlur);
    };
  }, [recording, otherValue, onChange, stopRecording]);

  const displayParts = recording && previewParts.length > 0
    ? previewParts
    : parseAccelerator(value);

  return (
    <div className="space-y-1.5">
      <label className="block text-sm text-text-secondary">{label}</label>
      <div
        ref={fieldRef}
        onClick={() => !recording && startRecording()}
        className={`flex items-center gap-1.5 h-9 px-3 rounded-md border cursor-pointer transition-all ${
          recording
            ? "border-accent animate-shortcut-pulse bg-bg-input"
            : conflict
              ? "border-error animate-shortcut-shake bg-bg-input"
              : "border-border bg-bg-input hover:border-border-focus"
        }`}
      >
        {recording && previewParts.length === 0 ? (
          <span className="text-sm text-text-muted">Press shortcut...</span>
        ) : (
          displayParts.map((part, i) => (
            <span key={i} className="flex items-center gap-1">
              {i > 0 && <span className="text-text-muted text-xs">+</span>}
              <kbd className="px-1.5 py-0.5 text-xs font-mono rounded bg-white/10 text-text-primary">
                {PLATFORM_LABELS[part] || part}
              </kbd>
            </span>
          ))
        )}
      </div>
      <p className="text-xs text-text-muted">{hint}</p>
    </div>
  );
}
