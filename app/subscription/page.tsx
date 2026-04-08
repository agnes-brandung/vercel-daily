import Subscription from '@/components/Subscription/Subscription';
import { InfoMessage } from '@/components/ui/InfoMessage';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import { Suspense } from 'react';

export default function SubscriptionPage() {
  return (
    <Suspense fallback={
      <InfoMessage type="loading" message="Loading subscription status...">
        <LoadingSkeleton type="card" />
      </InfoMessage>
    }>
      <Subscription />
    </Suspense>
  );
}
