'use client';

import { useActionState } from 'react';
import { useFormStatus } from 'react-dom';

import Button from '@/components/ui/Button';
import { InfoMessage } from '@/ui/InfoMessage';
import {
  subscribeAction,
  unsubscribeAction,
  type SubscriptionActionState,
} from '@/app/actions/subscription';

type SubscriptionButtonProps = {
  isActive: boolean;
  hasToken: boolean;
  hideUnsubscribe?: boolean;
}

/**
 * SubscriptionButton was built as form components with useActionState. No need for (zod) validation since we are only using a SubmitButton.
 * However, this allows an easy implementation of:
 * - Mutations on the server – Cookie reads/writes and calls like activateSubscription / deactivateSubscription stay in 'use server' code, so tokens and any backend secrets are not exposed to the client.
 * - Keep typed result state (SubscriptionActionState) and show InfoMessage from the last submission with useActionState + <form action={...}> – You k
 * - Returning errors instead of throwing for expected failures (“surface errors without leaking stack traces”)
 * - Displaying pending state on the button with useFormStatus + SubmitButton
 * 
 * subscribeAction / unsubscribeAction – 'use server' functions from @/app/actions/subscription. 
 * When the matching <form> is submitted, React runs that action on the server.
 * subscribeFormAction / unsubscribeFormAction – the function you pass to <form action={...}>. It submits the form and feeds the result back into the hook so the component can re-render (to to show InfoMessage when ok is false)
 * One hook per form: hooks run server actions on submit, and keep the last result in state for the UI.
 */
export function SubscriptionButton({ isActive, hasToken, hideUnsubscribe }: SubscriptionButtonProps) {
  const initialState: SubscriptionActionState = { ok: true };
  const [subscribeState, subscribeFormAction] = useActionState(subscribeAction, initialState);
  const [unsubscribeState, unsubscribeFormAction] = useActionState(unsubscribeAction, initialState);

  const error =
    !subscribeState.ok ? subscribeState.error : !unsubscribeState.ok ? unsubscribeState.error : null;

  return (
    <div className="flex flex-col gap-3">
      {error ? <InfoMessage type="error" message={error} /> : null}
      {hideUnsubscribe ? null : (
        isActive ? (
          <form action={unsubscribeFormAction}>
            <SubmitButton
              variant="secondary"
              label="Unsubscribe"
            />
          </form>
        ) : (
          <form action={subscribeFormAction}>
            <SubmitButton
              attentionPulse
              label={hasToken ? 'Activate subscription' : 'Subscribe'}
            />
          </form>
        )
      )}
    </div>
  );
}

/**
 * useFormStatus only works in components that are children of a <form>. That's why we extract the submit button into its own component. This pattern keeps loading state isolated and reusable.
 */
function SubmitButton({
  label,
  variant,
  attentionPulse,
}: {
  label: string;
  variant?: React.ComponentProps<typeof Button>['variant'];
  attentionPulse?: boolean;
}) {
  const { pending } = useFormStatus();

  return (
    <Button
      variant={variant}
      type="submit"
      label={label}
      disabled={pending}
      isLoading={pending}
      className={attentionPulse && !pending ? 'subscription-cta-attention' : undefined}
    />
  );
}
