import { getSubscriptionStatus } from '@/lib/server-data/getSubscriptionStatus';

import { SubscriptionButton } from './SubscriptionButton';
import { InfoMessage } from '@/ui/InfoMessage';

export default async function Subscription() {
  const { isActive, hasToken, error } = await getSubscriptionStatus();

  if (error) {
    return <InfoMessage type="error" message={error} />;
  }

  return (
    <SubscriptionButton isActive={isActive} hasToken={hasToken} />
  );
}
