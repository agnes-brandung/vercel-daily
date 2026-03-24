import { useSyncExternalStore } from "react";

let mounted = false;
let flushScheduled = false;
const listeners = new Set<() => void>();

function flush() {
  flushScheduled = false;
  if (!mounted) {
    mounted = true;
  }
  listeners.forEach((l) => l());
}

function subscribe(onStoreChange: () => void) {
  listeners.add(onStoreChange);
  if (mounted) {
    queueMicrotask(() => onStoreChange());
  } else if (!flushScheduled) {
    flushScheduled = true;
    queueMicrotask(flush);
  }
  return () => {
    listeners.delete(onStoreChange);
  };
}

export function useHasMounted(): boolean {
  return useSyncExternalStore(subscribe, () => mounted, () => false);
}
