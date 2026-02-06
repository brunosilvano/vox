export interface ShortcutCallbacks {
  onStart: () => void;
  onStop: () => void;
}

type RecordingState = "idle" | "hold" | "toggle";

export class ShortcutStateMachine {
  private state: RecordingState = "idle";
  private readonly callbacks: ShortcutCallbacks;

  constructor(callbacks: ShortcutCallbacks) {
    this.callbacks = callbacks;
  }

  handleHoldKeyDown(): void {
    if (this.state !== "idle") return;
    this.state = "hold";
    this.callbacks.onStart();
  }

  handleHoldKeyUp(): void {
    if (this.state !== "hold") return;
    this.state = "idle";
    this.callbacks.onStop();
  }

  handleTogglePress(): void {
    if (this.state === "idle") {
      this.state = "toggle";
      this.callbacks.onStart();
    } else if (this.state === "toggle") {
      this.state = "idle";
      this.callbacks.onStop();
    }
    // If state is "hold", ignore toggle press
  }

  getState(): RecordingState {
    return this.state;
  }
}
