// Simplified scroll position hook.
// To avoid "Maximum update depth exceeded" errors coming from scroll-based
// state updates, this implementation is intentionally side-effect free.
// If you later need true scroll tracking, we can reintroduce it with a
// carefully designed effect and consumers that don't create feedback loops.
export const useScrollPosition = () => {
  return 0;
};
