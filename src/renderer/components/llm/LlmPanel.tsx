import { useState } from "react";
import { useConfigStore } from "../../stores/config-store";
import { FoundryFields } from "./FoundryFields";
import { BedrockFields } from "./BedrockFields";
import { StatusBox } from "../ui/StatusBox";

export function LlmPanel() {
  const config = useConfigStore((s) => s.config);
  const updateConfig = useConfigStore((s) => s.updateConfig);
  const saveConfig = useConfigStore((s) => s.saveConfig);
  const [testing, setTesting] = useState(false);
  const [testStatus, setTestStatus] = useState({ text: "", type: "info" as const });

  if (!config) return null;

  const handleProviderChange = (provider: string) => {
    updateConfig({ llm: { ...config.llm, provider } });
    saveConfig();
  };

  const handleTest = async () => {
    setTesting(true);
    setTestStatus({ text: "Testing connection...", type: "info" });
    await saveConfig();

    try {
      const result = await window.voxApi.llm.test();
      if (result.ok) {
        setTestStatus({ text: "Connection successful", type: "success" });
      } else {
        setTestStatus({ text: `Connection failed: ${result.error}`, type: "error" });
      }
    } catch (err: any) {
      setTestStatus({ text: `Connection failed: ${err.message}`, type: "error" });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="rounded-lg border border-border bg-bg-card">
      <div className="px-5 pt-5 pb-3">
        <h2 className="text-base font-semibold">LLM Provider</h2>
        <p className="text-xs text-text-secondary mt-1">Configure the language model used for post-processing transcriptions.</p>
      </div>
      <div className="px-5 pb-5 space-y-4">
        <div className="space-y-1.5">
          <label htmlFor="llm-provider" className="block text-sm text-text-secondary">Provider</label>
          <select
            id="llm-provider"
            value={config.llm.provider || "foundry"}
            onChange={(e) => handleProviderChange(e.target.value)}
            className="w-full h-9 px-3 rounded-md bg-bg-input border border-border text-text-primary text-sm outline-none transition-colors focus:border-border-focus"
          >
            <option value="foundry">Microsoft Foundry</option>
            <option value="bedrock">AWS Bedrock</option>
          </select>
        </div>

        {config.llm.provider === "bedrock" ? <BedrockFields /> : <FoundryFields />}

        <div className="pt-4 border-t border-border">
          <button
            onClick={handleTest}
            disabled={testing}
            className="px-3 py-1.5 text-sm rounded-md border border-border bg-bg-input text-text-secondary hover:text-text-primary hover:border-border-focus transition-colors disabled:opacity-50"
          >
            Test Connection
          </button>
          <StatusBox text={testStatus.text} type={testStatus.type} />
        </div>
      </div>
    </div>
  );
}
