/** Number inputs change value on scroll-wheel by default, which silently mutated values
 *  users had already typed. Block the wheel while the input is focused; page scroll
 *  still works otherwise. */
export function blockWheel(input: HTMLInputElement) {
  const listener = (event: WheelEvent) => {
    if (document.activeElement === input) event.preventDefault();
  };
  input.addEventListener('wheel', listener, { passive: false });
  return {
    destroy() {
      input.removeEventListener('wheel', listener);
    },
  };
}
