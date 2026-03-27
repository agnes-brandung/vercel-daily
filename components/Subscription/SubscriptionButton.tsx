'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

import Button from '@/components/ui/Button';
import { readClientApiError } from '@/lib/api/readClientApiError';
import { InfoMessage } from '@/ui/InfoMessage';

interface SubscriptionButtonProps {
  isActive: boolean;
  hasToken: boolean;
}

/**
 * Subscribe: `POST /api/subscription/create` (if no token) then `POST /api/subscription` to activate.
 * Unsubscribe: `DELETE /api/subscription`.
 */
export function SubscriptionButton({ isActive, hasToken }: SubscriptionButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function subscribe() {
    setLoading(true);
    setError(null);
    try {
      if (!hasToken) {
        const createRes = await fetch('/api/subscription/create', { method: 'POST' });
        if (!createRes.ok) {
          setError(await readClientApiError(createRes, 'Could not create subscription'));
          return;
        }
      }
      const activateRes = await fetch('/api/subscription', { method: 'POST' });
      if (!activateRes.ok) {
        setError(await readClientApiError(activateRes, 'Could not activate subscription'));
        return;
      }
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  async function unsubscribe() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/subscription', { method: 'DELETE' });
      if (!res.ok) {
        setError(await readClientApiError(res, 'Could not unsubscribe'));
        return;
      }
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {error ? <InfoMessage type="error" message={error} /> : null}
      {isActive ? (
        <Button
          variant="secondary"
          type="button"
          label="Unsubscribe"
          disabled={loading}
          isLoading={loading}
          onClick={unsubscribe}
        />
      ) : (
        <Button
          type="button"
          label="Subscribe"
          disabled={loading}
          isLoading={loading}
          onClick={subscribe}
        />
      )}
    </div>
  );
}
