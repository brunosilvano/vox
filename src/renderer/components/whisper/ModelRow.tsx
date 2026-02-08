import { useState } from "react";
import type { ModelInfo } from "../../../preload/index";

interface ModelRowProps {
  model: ModelInfo;
  selected: boolean;
  onSelect: (size: string) => void;
}

export function ModelRow({ model, selected, onSelect }: ModelRowProps) {
  const [downloading, setDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(model.downloaded);

  const handleDownload = async () => {
    setDownloading(true);
    await window.voxApi.models.download(model.size);
    setDownloaded(true);
    setDownloading(false);
  };

  return (
    <div className="flex items-center justify-between py-2.5 px-3 rounded-md hover:bg-bg-hover transition-colors">
      <label className="flex items-center gap-3 cursor-pointer flex-1">
        <input
          type="radio"
          name="whisper-model"
          value={model.size}
          checked={selected}
          onChange={() => onSelect(model.size)}
          className="accent-accent"
        />
        <span className="text-sm font-medium">{model.size}</span>
        <span className="text-xs text-text-secondary">{model.info.description}</span>
      </label>
      {downloaded ? (
        <span className="text-xs text-success font-medium">Downloaded</span>
      ) : (
        <button
          onClick={handleDownload}
          disabled={downloading}
          className="px-2.5 py-1 text-xs rounded-md border border-border bg-bg-input text-text-secondary hover:text-text-primary hover:border-border-focus transition-colors disabled:opacity-50"
        >
          {downloading ? "Downloading..." : "Download"}
        </button>
      )}
    </div>
  );
}
