import { describe, it, expect, vi } from "vitest";
import { ShortcutStateMachine } from "../../../src/main/shortcuts/listener";

describe("ShortcutStateMachine", () => {
  it("should emit start on hold key down", () => {
    const onStart = vi.fn();
    const onStop = vi.fn();
    const sm = new ShortcutStateMachine({ onStart, onStop });

    sm.handleHoldKeyDown();

    expect(onStart).toHaveBeenCalledOnce();
    expect(onStop).not.toHaveBeenCalled();
  });

  it("should emit stop on hold key up", () => {
    const onStart = vi.fn();
    const onStop = vi.fn();
    const sm = new ShortcutStateMachine({ onStart, onStop });

    sm.handleHoldKeyDown();
    sm.handleHoldKeyUp();

    expect(onStop).toHaveBeenCalledOnce();
  });

  it("should not emit stop if hold was never started", () => {
    const onStart = vi.fn();
    const onStop = vi.fn();
    const sm = new ShortcutStateMachine({ onStart, onStop });

    sm.handleHoldKeyUp();

    expect(onStop).not.toHaveBeenCalled();
  });

  it("should toggle on first press and stop on second press", () => {
    const onStart = vi.fn();
    const onStop = vi.fn();
    const sm = new ShortcutStateMachine({ onStart, onStop });

    sm.handleTogglePress();
    expect(onStart).toHaveBeenCalledOnce();

    sm.handleTogglePress();
    expect(onStop).toHaveBeenCalledOnce();
  });

  it("should not allow simultaneous hold and toggle", () => {
    const onStart = vi.fn();
    const onStop = vi.fn();
    const sm = new ShortcutStateMachine({ onStart, onStop });

    sm.handleHoldKeyDown();
    sm.handleTogglePress(); // should be ignored

    expect(onStart).toHaveBeenCalledTimes(1);
  });
});
