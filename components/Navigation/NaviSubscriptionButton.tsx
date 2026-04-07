import { getSubscriptionStatus } from '@/lib/subscription';
import { SubscriptionButton } from '../Subscription/SubscriptionButton';

export default async function NavigationSubscriptionButton() {
  const { isActive, hasToken } = await getSubscriptionStatus();

  return (
    <SubscriptionButton isActive={isActive} hasToken={hasToken} />
  );
}