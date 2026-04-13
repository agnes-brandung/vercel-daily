'use client';

import {
  useActionState,
} from 'react';
import { useFormStatus } from 'react-dom';

import Button from '@/components/ui/Button';
import { InfoMessage } from '@/ui/InfoMessage';
import {
  subscribeAction,
  unsubscribeAction,
  type SubscriptionActionState,
} from '@/app/actions/subscription';
import { GuardedServerActionForm } from '../GuardedServerActionForm';

type SubscriptionButtonProps = {
  isActive: boolean;
  hasToken: boolean;
  hideUnsubscribe?: boolean;
};

/**
 * Subscription flows use `useActionState` + `<form action={…}>` (no Zod: submit-only).
 *
 * **A11y:** We avoid native `disabled` on submit during flight so the control stays in the tab order.
 * - **`aria-busy`** — tells assistive tech an update is in progress (loading semantics).
 * - **`aria-disabled`** — says the control is not operable *without* removing it from focus order; we still
 *   must block activation in JS (button `onClick` in `Button` + form `onSubmit` here) per WAI-ARIA.
 * Using both is intentional: busy = “working”, disabled = “don’t activate again”.
 *
 * **Guards:** `GuardedServerActionForm` debounces submits by `SUBMIT_DEBOUNCE_MS` and drops submits while
 * `useFormStatus().pending` is true (ref-synced), so duplicate requests are unlikely without relying on
 * `disabled`.
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
      {hideUnsubscribe ? null : isActive ? (
        <GuardedServerActionForm action={unsubscribeFormAction}> 
          <SubmitButton variant="secondary" label="Unsubscribe" />
        </GuardedServerActionForm>
      ) : (
        <GuardedServerActionForm action={subscribeFormAction}>
          <SubmitButton attentionPulse label={hasToken ? 'Activate subscription' : 'Subscribe'} />
        </GuardedServerActionForm>
      )}
    </div>
  );
}

/**
 * `useFormStatus` only works under `<form>`; keep submit UI in a child of the guarded form.
 */
function SubmitButton({
  label,
  variant = 'primary',
  attentionPulse = true,
}: {
  label: string;
  variant?: React.ComponentProps<typeof Button>['variant'];
  attentionPulse?: boolean;
}) {
  const { pending } = useFormStatus();
  const animationStyles = attentionPulse && !pending ? 'subscription-cta-attention' : undefined;

  return (
    <div className="w-56">
      <Button
        variant={variant}
        type="submit"
        label={label}
        isLoading={pending}
        ariaBusy={pending}
        ariaDisabled={pending}
        className={animationStyles}
        fullWidth
        truncateLabel={true}
      />
    </div>
  );
}
