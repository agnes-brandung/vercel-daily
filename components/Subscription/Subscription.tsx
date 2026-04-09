import { getSubscriptionStatus } from '@/lib/server-data/getSubscriptionStatus';

import { SubscriptionButton } from './SubscriptionButton';

export default async function Subscription() {
  const { isActive, hasToken } = await getSubscriptionStatus();

  return (
    <SubscriptionButton isActive={isActive} hasToken={hasToken} />
  );
}
