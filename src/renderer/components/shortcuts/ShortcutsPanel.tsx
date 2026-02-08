import { useConfigStore } from "../../stores/config-store";
import { ShortcutRecorder } from "./ShortcutRecorder";

export function ShortcutsPanel() {
  const config = useConfigStore((s) => s.config);
  const updateConfig = useConfigStore((s) => s.updateConfig);
  const saveConfig = useConfigStore((s) => s.saveConfig);

  if (!config) return null;

  const setHold = (accelerator: string) => {
    updateConfig({ shortcuts: { ...config.shortcuts, hold: accelerator } });
    saveConfig();
  };

  const setToggle = (accelerator: string) => {
    updateConfig({ shortcuts: { ...config.shortcuts, toggle: accelerator } });
    saveConfig();
  };

  const restoreDefaults = () => {
    updateConfig({ shortcuts: { hold: "Alt+Space", toggle: "Alt+Shift+Space" } });
    saveConfig();
  };

  return (
    <div className="rounded-lg border border-border bg-bg-card">
      <div className="px-5 pt-5 pb-3">
        <h2 className="text-base font-semibold">Keyboard Shortcuts</h2>
        <p className="text-xs text-text-secondary mt-1">Configure the keyboard shortcuts for voice recording. Click a field and press your desired key combination.</p>
      </div>
      <div className="px-5 pb-5 space-y-4">
        <ShortcutRecorder
          label="Hold mode"
          hint="Hold to record, release to stop."
          value={config.shortcuts.hold}
          otherValue={config.shortcuts.toggle}
          onChange={setHold}
        />
        <ShortcutRecorder
          label="Toggle mode"
          hint="Press once to start, press again to stop."
          value={config.shortcuts.toggle}
          otherValue={config.shortcuts.hold}
          onChange={setToggle}
        />
        <button
          onClick={restoreDefaults}
          className="px-3 py-1.5 text-sm rounded-md border border-border bg-bg-input text-text-secondary hover:text-text-primary hover:border-border-focus transition-colors"
        >
          Restore Defaults
        </button>
      </div>
    </div>
  );
}
