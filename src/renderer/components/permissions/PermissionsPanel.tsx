import { useState, useEffect } from "react";
import { useConfigStore } from "../../stores/config-store";
import { usePermissions } from "../../hooks/use-permissions";
import { PermissionRow } from "./PermissionRow";
import { PipelineTest } from "./PipelineTest";
import { MicIcon, LockIcon } from "../ui/icons";

export function PermissionsPanel() {
  const activeTab = useConfigStore((s) => s.activeTab);
  const { status, refresh, requestMicrophone, requestAccessibility } = usePermissions();
  const [requestingMic, setRequestingMic] = useState(false);

  useEffect(() => {
    if (activeTab === "permissions") refresh();
  }, [activeTab, refresh]);

  useEffect(() => {
    const handleFocus = () => {
      if (activeTab === "permissions") refresh();
    };
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [activeTab, refresh]);

  const handleMicRequest = async () => {
    setRequestingMic(true);
    await requestMicrophone();
    setRequestingMic(false);
  };

  const micGranted = status?.microphone === "granted";
  const accGranted = !!status?.accessibility;

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border bg-bg-card">
        <div className="px-5 pt-5 pb-3">
          <h2 className="text-base font-semibold">System Permissions</h2>
          <p className="text-xs text-text-secondary mt-1">Vox requires these macOS permissions to function properly.</p>
        </div>
        <div className="px-5 pb-5 space-y-1">
          <PermissionRow
            icon={<MicIcon />}
            name="Microphone"
            description="Required for voice recording"
            granted={micGranted}
            statusText={status?.microphone === "denied" ? "Denied" : undefined}
            buttonText="Grant Access"
            onRequest={handleMicRequest}
            requesting={requestingMic}
          />
          <PermissionRow
            icon={<LockIcon />}
            name="Accessibility"
            description="Required for auto-paste (Cmd+V simulation)"
            granted={accGranted}
            buttonText="Open Settings"
            onRequest={requestAccessibility}
          />
        </div>
      </div>

      <PipelineTest />
    </div>
  );
}
