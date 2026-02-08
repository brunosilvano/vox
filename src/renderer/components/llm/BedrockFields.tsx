import { useConfigStore } from "../../stores/config-store";
import { useDebouncedSave } from "../../hooks/use-debounced-save";
import { SecretInput } from "../ui/SecretInput";

export function BedrockFields() {
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
        <label htmlFor="llm-region" className="block text-sm text-text-secondary">Region</label>
        <input
          id="llm-region"
          type="text"
          value={config.llm.region || ""}
          onChange={(e) => update("region", e.target.value)}
          placeholder="us-east-1"
          className="w-full h-9 px-3 rounded-md bg-bg-input border border-border text-text-primary text-sm outline-none transition-colors focus:border-border-focus"
        />
      </div>
      <div className="space-y-1.5">
        <label htmlFor="llm-profile" className="block text-sm text-text-secondary">AWS Profile</label>
        <input
          id="llm-profile"
          type="text"
          value={config.llm.profile || ""}
          onChange={(e) => update("profile", e.target.value)}
          placeholder="default"
          className="w-full h-9 px-3 rounded-md bg-bg-input border border-border text-text-primary text-sm outline-none transition-colors focus:border-border-focus"
        />
        <p className="text-xs text-text-muted">Optional. Named profile from ~/.aws/credentials. Ignored when Access Key ID is provided.</p>
      </div>
      <div className="space-y-1.5">
        <label htmlFor="llm-access-key" className="block text-sm text-text-secondary">Access Key ID</label>
        <SecretInput
          id="llm-access-key"
          value={config.llm.accessKeyId || ""}
          onChange={(v) => update("accessKeyId", v)}
          placeholder="Leave empty to use default credentials"
        />
        <p className="text-xs text-text-muted">Optional. If empty, uses AWS default credential chain (env vars, ~/.aws/credentials, IAM roles).</p>
      </div>
      <div className="space-y-1.5">
        <label htmlFor="llm-secret-key" className="block text-sm text-text-secondary">Secret Access Key</label>
        <SecretInput
          id="llm-secret-key"
          value={config.llm.secretAccessKey || ""}
          onChange={(v) => update("secretAccessKey", v)}
          placeholder="Leave empty to use default credentials"
        />
      </div>
      <div className="space-y-1.5">
        <label htmlFor="llm-model-id" className="block text-sm text-text-secondary">Model ID</label>
        <input
          id="llm-model-id"
          type="text"
          value={config.llm.modelId || ""}
          onChange={(e) => update("modelId", e.target.value)}
          placeholder="anthropic.claude-3-5-sonnet-20241022-v2:0"
          className="w-full h-9 px-3 rounded-md bg-bg-input border border-border text-text-primary text-sm outline-none transition-colors focus:border-border-focus"
        />
      </div>
    </>
  );
}
