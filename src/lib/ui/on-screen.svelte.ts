/**
 * Whether an element is somewhere the user can see it, for a loop that has no business drawing
 * when nobody is looking.
 *
 * Every tab of the site stays mounted behind `display: none`, so an animation started in one goes
 * on drawing sixty frames a second while another tab is showing. An element inside a hidden tab
 * has no box at all, which is what the observer reports; the same observer reports a canvas
 * scrolled off the page.
 *
 * It says no until the observer has had its first say, which is the frame after the element is
 * mounted.
 */
export function onScreen(element: () => HTMLElement | null | undefined): { readonly showing: boolean } {
  let showing = $state(false);
  $effect(() => {
    const target = element();
    if (!target) return;
    const watcher = new IntersectionObserver((entries) => {
      showing = entries[entries.length - 1].isIntersecting;
    });
    watcher.observe(target);
    return () => watcher.disconnect();
  });
  return {
    get showing() {
      return showing;
    },
  };
}
