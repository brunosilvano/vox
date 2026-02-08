interface StatusBoxProps {
  text: string;
  type: "info" | "success" | "error";
}

const typeClasses: Record<string, string> = {
  info: "text-text-secondary",
  success: "text-success",
  error: "text-error",
};

export function StatusBox({ text, type }: StatusBoxProps) {
  if (!text) return null;

  return (
    <div
      className={`mt-3 text-[13px] whitespace-pre-wrap leading-relaxed ${typeClasses[type]}`}
    >
      {text}
    </div>
  );
}
