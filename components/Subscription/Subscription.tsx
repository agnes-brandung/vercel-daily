import { getSubscriptionStatus } from '@/lib/subscription';

import { SubscriptionButton } from './SubscriptionButton';

export default async function Subscription() {
  const { isActive, hasToken } = await getSubscriptionStatus();

  return (
    <div className="p-4">
      <SubscriptionButton isActive={isActive} hasToken={hasToken} />
    </div>
  );
}
