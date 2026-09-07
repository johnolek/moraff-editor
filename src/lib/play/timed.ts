import type { ScreenLine } from '../game/port/state';

/**
 * The delays both games hold a drawn message for — delay (exe 1000:2789) in Dungeons of the
 * Unforgiven and delay (WORLD.EXE 1000:22a2) in Moraff's World — as something a browser tab can
 * keep to.
 *
 * The original stops dead inside those calls: it is not reading the keyboard, no monster moves
 * and nothing about the character changes, so the pause is only ever about what is on the screen.
 * That is what makes it safe to keep here. The game logic runs straight through, and every time
 * it asks for a delay the screen as it stands at that moment is kept as a frame; the frames are
 * then shown in turn, each for as long as the call asked for. Nothing the timer does reaches the
 * game or the loop — it only decides which of the screens the game has already drawn is the one
 * the tab draws now.
 */

/** One screen the game asked to be left up, and how long for. */
interface Frame {
  screen: ScreenLine[];
  ms: number;
}

export class TimedScreens {
  /** The frames still to show, oldest first. The one being shown is not among them. */
  private queue: Frame[] = [];
  private current: Frame | null = null;
  private timer: ReturnType<typeof setTimeout> | null = null;

  /** @param changed tell the tab to draw, which is how a frame reaches the screen. */
  constructor(private readonly changed: () => void) {}

  /** Whether a frame is being shown, so that the live screen is not what the tab draws. */
  get holding(): boolean {
    return this.current !== null;
  }

  /** The game has drawn something and asked for the screen to be left as it is. */
  hold(screen: ScreenLine[], ms: number): void {
    if (ms <= 0) return;
    this.queue.push({ screen: screen.map((line) => ({ ...line })), ms });
    if (this.current === null) this.next();
  }

  /** What the tab draws: the frame being shown, or the screen the game has now. */
  showing(screen: ScreenLine[]): ScreenLine[] {
    return this.current === null ? screen : this.current.screen;
  }

  /**
   * A key has been pressed: the rest of the delays are given up at once and the screen the game
   * has now is what shows, which is where the original would have been by the time it looked at
   * the keyboard again.
   */
  release(): void {
    if (this.current === null) return;
    this.stop();
    this.changed();
  }

  /** Drop the timer without drawing, for a session that is finished with. */
  stop(): void {
    if (this.timer !== null) clearTimeout(this.timer);
    this.timer = null;
    this.current = null;
    this.queue = [];
  }

  /** Show the next frame, or hand the screen back to the game when there are none left. */
  private next(): void {
    this.current = this.queue.shift() ?? null;
    if (this.current === null) {
      this.timer = null;
      this.changed();
      return;
    }
    this.timer = setTimeout(() => this.next(), this.current.ms);
    this.changed();
  }
}
