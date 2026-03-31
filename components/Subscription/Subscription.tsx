import { getSubscriptionStatus } from '@/lib/subscription';

import { SubscriptionButton } from './SubscriptionButton';

export default async function Subscription() {
  const { isActive, hasToken } = await getSubscriptionStatus();

  return (
    <SubscriptionButton isActive={isActive} hasToken={hasToken} />
  );
}
