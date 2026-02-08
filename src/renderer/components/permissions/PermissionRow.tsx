import type { ReactNode } from "react";

interface PermissionRowProps {
  icon: ReactNode;
  name: string;
  description: string;
  granted: boolean;
  statusText?: string;
  buttonText: string;
  onRequest: () => void;
  requesting?: boolean;
}

export function PermissionRow({
  icon,
  name,
  description,
  granted,
  statusText,
  buttonText,
  onRequest,
  requesting,
}: PermissionRowProps) {
  return (
    <div className="flex items-center justify-between py-3 px-4 rounded-md hover:bg-bg-hover transition-colors">
      <div className="flex items-center gap-3">
        <span className="text-text-secondary">{icon}</span>
        <div>
          <div className="text-sm font-medium">{name}</div>
          <div className="text-xs text-text-muted">{description}</div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        {granted ? (
          <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-success/15 text-success">
            Granted
          </span>
        ) : (
          <>
            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-warning/15 text-warning">
              {statusText || "Not Granted"}
            </span>
            <button
              onClick={onRequest}
              disabled={requesting}
              className="px-2.5 py-1 text-xs rounded-md border border-border bg-bg-input text-text-secondary hover:text-text-primary hover:border-border-focus transition-colors disabled:opacity-50"
            >
              {requesting ? "Requesting..." : buttonText}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
