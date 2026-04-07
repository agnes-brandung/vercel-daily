import { type Dispatch, type SetStateAction, useCallback, useEffect, useRef } from 'react';

/** Close category popover after last toggle so the user can change several checkboxes first. */
const CATEGORY_POPOVER_CLOSE_DEBOUNCE_MS = 1500;

type UseCloseCategoryPopoverOptions = {
  setCategoryFilterOpen: Dispatch<SetStateAction<boolean>>;
}

export function useCloseCategoryPopover({
  setCategoryFilterOpen,
}: UseCloseCategoryPopoverOptions) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearCloseTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const scheduleCloseCategoryPopover = useCallback(() => {
    clearCloseTimer();
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      setCategoryFilterOpen(false);
    }, CATEGORY_POPOVER_CLOSE_DEBOUNCE_MS);
  }, [clearCloseTimer, setCategoryFilterOpen]);

  useEffect(() => {
    return () => {
      clearCloseTimer();
    };
  }, [clearCloseTimer]);

  return { scheduleCloseCategoryPopover, clearCloseCategoryPopoverTimer: clearCloseTimer };
}
