import { useConfigStore } from "../../stores/config-store";

const TABS = [
  { id: "llm", label: "LLM Provider" },
  { id: "whisper", label: "Whisper Model" },
  { id: "shortcuts", label: "Shortcuts" },
  { id: "permissions", label: "Permissions" },
];

export function TabNav() {
  const activeTab = useConfigStore((s) => s.activeTab);
  const setActiveTab = useConfigStore((s) => s.setActiveTab);

  return (
    <nav className="titlebar-no-drag flex gap-1 px-5 pb-2">
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`px-3 py-1.5 text-[13px] font-medium rounded-md transition-colors ${
            activeTab === tab.id
              ? "bg-white/10 text-text-primary"
              : "text-text-secondary hover:text-text-primary hover:bg-white/5"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}
