import { ReactNode, RefObject, useEffect, useRef } from 'react';
import { useFormStatus } from 'react-dom';

type GuardedServerActionFormProps = {
  action: React.ComponentProps<'form'>['action'];
  children: ReactNode;
  debounceMs?: number;
}

function FormPendingRefSync({
  pendingRef,
  lastSubmitAtRef,
}: {
  pendingRef: RefObject<boolean>;
  lastSubmitAtRef: RefObject<number>;
}) {
  const { pending } = useFormStatus();

  useEffect(() => {
    pendingRef.current = pending;
    if (!pending) {
      lastSubmitAtRef.current = 0;
    }
  }, [pending, pendingRef, lastSubmitAtRef]);

  return null;
}

export function GuardedServerActionForm({ action, children, debounceMs = 300 }: GuardedServerActionFormProps) {
  const pendingRef = useRef(false);
  const lastSubmitAtRef = useRef(0);

  function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    if (pendingRef.current) {
      event.preventDefault();
      return;
    }
    const now = Date.now();
    if (now - lastSubmitAtRef.current < debounceMs) {
      event.preventDefault();
      return;
    }
    lastSubmitAtRef.current = now;
  }

  return (
    <form action={action} onSubmit={handleSubmit}>
      <FormPendingRefSync pendingRef={pendingRef} lastSubmitAtRef={lastSubmitAtRef} />
      {children}
    </form>
  );
}