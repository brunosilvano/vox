import { useState, useEffect } from "react";
import { useConfigStore } from "../../stores/config-store";
import { ModelRow } from "./ModelRow";
import { StatusBox } from "../ui/StatusBox";
import { recordAudio } from "../../utils/record-audio";
import type { ModelInfo } from "../../../preload/index";

export function WhisperPanel() {
  const config = useConfigStore((s) => s.config);
  const updateConfig = useConfigStore((s) => s.updateConfig);
  const saveConfig = useConfigStore((s) => s.saveConfig);
  const [models, setModels] = useState<ModelInfo[]>([]);
  const [testing, setTesting] = useState(false);
  const [testStatus, setTestStatus] = useState({ text: "", type: "info" as const });

  useEffect(() => {
    window.voxApi.models.list().then(setModels);
  }, []);

  if (!config) return null;

  const handleSelect = (size: string) => {
    updateConfig({ whisper: { model: size as any } });
    saveConfig();
  };

  const handleTest = async () => {
    setTesting(true);
    setTestStatus({ text: "Recording for 5 seconds...", type: "info" });
    await saveConfig();

    try {
      const recording = await recordAudio(5);
      setTestStatus({ text: "Transcribing...", type: "info" });
      const text = await window.voxApi.whisper.test(recording);
      setTestStatus({
        text: text || "(no speech detected)",
        type: text ? "success" : "info",
      });
    } catch (err: any) {
      setTestStatus({ text: `Test failed: ${err.message}`, type: "error" });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="rounded-lg border border-border bg-bg-card">
      <div className="px-5 pt-5 pb-3">
        <h2 className="text-base font-semibold">Whisper Model</h2>
        <p className="text-xs text-text-secondary mt-1">Select the local speech recognition model. Larger models are more accurate but slower.</p>
      </div>
      <div className="px-5 pb-5">
        <div className="space-y-1">
          {models.map((model) => (
            <ModelRow
              key={model.size}
              model={model}
              selected={model.size === config.whisper.model}
              onSelect={handleSelect}
            />
          ))}
        </div>

        <div className="pt-4 mt-4 border-t border-border">
          <button
            onClick={handleTest}
            disabled={testing}
            className="px-3 py-1.5 text-sm rounded-md border border-border bg-bg-input text-text-secondary hover:text-text-primary hover:border-border-focus transition-colors disabled:opacity-50"
          >
            Test Whisper
          </button>
          <p className="text-xs text-text-muted mt-2">Records 5 seconds of audio and runs it through the selected model.</p>
          <StatusBox text={testStatus.text} type={testStatus.type} />
        </div>
      </div>
    </div>
  );
}
