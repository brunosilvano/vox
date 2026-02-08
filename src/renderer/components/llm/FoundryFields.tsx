import { useConfigStore } from "../../stores/config-store";
import { useDebouncedSave } from "../../hooks/use-debounced-save";
import { SecretInput } from "../ui/SecretInput";

export function FoundryFields() {
  const config = useConfigStore((s) => s.config);
  const updateConfig = useConfigStore((s) => s.updateConfig);
  const debouncedSave = useDebouncedSave();

  if (!config) return null;

  const update = (field: string, value: string) => {
    updateConfig({ llm: { ...config.llm, [field]: value } });
    debouncedSave();
  };

  return (
    <>
      <div className="space-y-1.5">
        <label htmlFor="llm-endpoint" className="block text-sm text-text-secondary">Endpoint</label>
        <input
          id="llm-endpoint"
          type="url"
          value={config.llm.endpoint}
          onChange={(e) => update("endpoint", e.target.value)}
          placeholder="https://your-resource.services.ai.azure.com/anthropic"
          className="w-full h-9 px-3 rounded-md bg-bg-input border border-border text-text-primary text-sm outline-none transition-colors focus:border-border-focus"
        />
      </div>
      <div className="space-y-1.5">
        <label htmlFor="llm-apikey" className="block text-sm text-text-secondary">API Key</label>
        <SecretInput
          id="llm-apikey"
          value={config.llm.apiKey}
          onChange={(v) => update("apiKey", v)}
          placeholder="Enter your API key"
        />
      </div>
      <div className="space-y-1.5">
        <label htmlFor="llm-model" className="block text-sm text-text-secondary">Model</label>
        <input
          id="llm-model"
          type="text"
          value={config.llm.model}
          onChange={(e) => update("model", e.target.value)}
          placeholder="gpt-4o"
          className="w-full h-9 px-3 rounded-md bg-bg-input border border-border text-text-primary text-sm outline-none transition-colors focus:border-border-focus"
        />
      </div>
    </>
  );
}
