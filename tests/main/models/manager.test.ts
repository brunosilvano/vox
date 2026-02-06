import { describe, it, expect, beforeEach, afterEach } from "vitest";
import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { ModelManager } from "../../../src/main/models/manager";

describe("ModelManager", () => {
  let testDir: string;
  let manager: ModelManager;

  beforeEach(() => {
    testDir = fs.mkdtempSync(path.join(os.tmpdir(), "vox-models-"));
    manager = new ModelManager(testDir);
  });

  afterEach(() => {
    fs.rmSync(testDir, { recursive: true, force: true });
  });

  it("should report model as not downloaded when directory is empty", () => {
    expect(manager.isModelDownloaded("small")).toBe(false);
  });

  it("should report model as downloaded when file exists", () => {
    fs.writeFileSync(path.join(testDir, "ggml-small.bin"), "fake-model-data");
    expect(manager.isModelDownloaded("small")).toBe(true);
  });

  it("should return correct file path for a model", () => {
    const expected = path.join(testDir, "ggml-small.bin");
    expect(manager.getModelPath("small")).toBe(expected);
  });

  it("should list available model sizes", () => {
    const sizes = manager.getAvailableSizes();
    expect(sizes).toContain("tiny");
    expect(sizes).toContain("base");
    expect(sizes).toContain("small");
    expect(sizes).toContain("medium");
    expect(sizes).toContain("large");
  });
});
