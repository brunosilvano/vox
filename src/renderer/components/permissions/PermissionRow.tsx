import type { ReactNode } from "react";
import styles from "./PermissionRow.module.scss";
import btn from "../shared/buttons.module.scss";

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
    <div className={styles.row}>
      <div className={styles.info}>
        {icon}
        <div>
          <div className={styles.name}>{name}</div>
          <div className={styles.desc}>{description}</div>
        </div>
      </div>
      <div className={styles.action}>
        {granted ? (
          <span className={`${styles.badge} ${styles.granted}`}>Granted</span>
        ) : (
          <>
            <span className={`${styles.badge} ${styles.missing}`}>
              {statusText || "Not Granted"}
            </span>
            <button
              onClick={onRequest}
              disabled={requesting}
              className={`${btn.btn} ${btn.secondary} ${btn.sm}`}
            >
              {requesting ? "Requesting..." : buttonText}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
