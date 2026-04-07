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
      className={attentionPulse ? 'subscription-cta-attention' : undefined}
    />
  );
}
