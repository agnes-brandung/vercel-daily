import Subscription from '@/components/Subscription/Subscription';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import { Suspense } from 'react';

export default function SubscriptionPage() {
  return (
    <Suspense fallback={<LoadingSkeleton type="button" />}>
      <Subscription />
    </Suspense>
  );
}
