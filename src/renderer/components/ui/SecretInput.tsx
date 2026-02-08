import { useState } from "react";
import { EyeIcon } from "./icons";

interface SecretInputProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SecretInput({ id, value, onChange, placeholder }: SecretInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="flex gap-2">
      <input
        id={id}
        type={visible ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1 h-9 px-3 rounded-md bg-bg-input border border-border text-text-primary text-sm outline-none transition-colors focus:border-border-focus"
      />
      <button
        type="button"
        onClick={() => setVisible(!visible)}
        className="w-9 h-9 flex items-center justify-center rounded-md border border-border bg-bg-input text-text-secondary hover:text-text-primary hover:border-border-focus transition-colors"
        title="Show/hide"
      >
        <EyeIcon />
      </button>
    </div>
  );
}
