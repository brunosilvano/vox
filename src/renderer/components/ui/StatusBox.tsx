import styles from "./StatusBox.module.scss";

interface StatusBoxProps {
  text: string;
  type: "info" | "success" | "error";
}

export function StatusBox({ text, type }: StatusBoxProps) {
  if (!text) return null;

  return (
    <div className={`${styles.box} ${styles[type]}`}>
      {text}
    </div>
  );
}
