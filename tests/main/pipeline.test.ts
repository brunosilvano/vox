import { describe, it, expect, vi } from "vitest";
import { Pipeline } from "../../src/main/pipeline";
import { type LlmProvider } from "../../src/main/llm/provider";

describe("Pipeline", () => {
  const mockRecorder = {
    start: vi.fn(),
    stop: vi.fn().mockResolvedValue({
      audioBuffer: new Float32Array([0.1, 0.2]),
      sampleRate: 16000,
    }),
  };

  const mockTranscribe = vi.fn().mockResolvedValue({ text: "raw transcription" });

  const mockProvider: LlmProvider = {
    correct: vi.fn().mockResolvedValue("corrected text"),
  };

  const mockPaste = vi.fn();

  it("should run the full pipeline: record -> transcribe -> correct -> paste", async () => {
    const pipeline = new Pipeline({
      recorder: mockRecorder,
      transcribe: mockTranscribe,
      llmProvider: mockProvider,
      paste: mockPaste,
      modelPath: "/models/ggml-small.bin",
    });

    await pipeline.startRecording();
    const result = await pipeline.stopAndProcess();

    expect(mockRecorder.start).toHaveBeenCalled();
    expect(mockRecorder.stop).toHaveBeenCalled();
    expect(mockTranscribe).toHaveBeenCalled();
    expect(mockProvider.correct).toHaveBeenCalledWith("raw transcription");
    expect(mockPaste).toHaveBeenCalledWith("corrected text");
    expect(result).toBe("corrected text");
  });

  it("should paste raw text if LLM correction fails", async () => {
    const failingProvider: LlmProvider = {
      correct: vi.fn().mockRejectedValue(new Error("LLM unavailable")),
    };

    const pipeline = new Pipeline({
      recorder: mockRecorder,
      transcribe: mockTranscribe,
      llmProvider: failingProvider,
      paste: mockPaste,
      modelPath: "/models/ggml-small.bin",
    });

    await pipeline.startRecording();
    const result = await pipeline.stopAndProcess();

    expect(mockPaste).toHaveBeenCalledWith("raw transcription");
    expect(result).toBe("raw transcription");
  });
});
