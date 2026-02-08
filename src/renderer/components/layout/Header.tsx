import { useEffect, useState } from "react";

export function Header() {
  const [logoSrc, setLogoSrc] = useState("");

  useEffect(() => {
    window.voxApi.resources.dataUrl("trayIcon@8x.png").then(setLogoSrc);
  }, []);

  return (
    <header className="titlebar-drag flex items-center justify-between px-5 pt-6 pb-4">
      <div className="flex items-center gap-3">
        {logoSrc && <img alt="Vox" src={logoSrc} className="w-7 h-7" />}
        <span className="text-lg font-semibold tracking-tight">Vox</span>
      </div>
      <span className="text-xs text-text-secondary tracking-wide uppercase">Home</span>
    </header>
  );
}
