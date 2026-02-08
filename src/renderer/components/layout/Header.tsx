import { useEffect, useState } from "react";
import styles from "./Header.module.scss";

export function Header() {
  const [logoSrc, setLogoSrc] = useState("");

  useEffect(() => {
    window.voxApi.resources.dataUrl("trayIcon@8x.png").then(setLogoSrc);
  }, []);

  return (
    <header className={styles.header}>
      <div className={styles.title}>
        {logoSrc && <img alt="Vox" src={logoSrc} className={styles.logo} />}
        <span>Vox</span>
      </div>
    </header>
  );
}
