import { useState } from "react";
import { recordAudio } from "../../utils/record-audio";
import { StatusBox } from "../ui/StatusBox";
import { RecordIcon } from "../ui/icons";

export function PipelineTest() {
  const [testing, setTesting] = useState(false);
  const [testStatus, setTestStatus] = useState({ text: "", type: "info" as const });

  const handleTest = async () => {
    setTesting(true);
    setTestStatus({ text: "Recording for 5 seconds...", type: "info" });

    try {
      const recording = await recordAudio(5);
      setTestStatus({ text: "Transcribing...", type: "info" });
      const result = await window.voxApi.pipeline.testTranscribe(recording);

      let output = `Whisper: ${result.rawText || "(empty)"}`;
      if (result.correctedText) {
        output += `\nLLM:     ${result.correctedText}`;
        setTestStatus({ text: output, type: "success" });
      } else if (result.llmError) {
        output += `\nLLM error: ${result.llmError}`;
        setTestStatus({ text: output, type: "error" });
      } else {
        setTestStatus({ text: output, type: "success" });
      }
    } catch (err: any) {
      setTestStatus({ text: `Test failed: ${err.message}`, type: "error" });
    } finally {
      setTesting(false);
    }
  };

  return (
    <div className="rounded-lg border border-border bg-bg-card">
      <div className="px-5 pt-5 pb-3">
        <h2 className="text-base font-semibold">Pipeline Test</h2>
        <p className="text-xs text-text-secondary mt-1">Record a 5-second audio sample to test transcription and LLM correction.</p>
      </div>
      <div className="px-5 pb-5">
        <button
          onClick={handleTest}
          disabled={testing}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md bg-accent text-white hover:bg-accent-hover transition-colors disabled:opacity-50"
        >
          <RecordIcon />
          Record 5s Test
        </button>
        <StatusBox text={testStatus.text} type={testStatus.type} />
      </div>
    </div>
  );
}
