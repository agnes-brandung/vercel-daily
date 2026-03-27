import Subscription from '@/components/Subscription/Subscription';
import { InfoMessage } from '@/components/ui/InfoMessage';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';
import { Copy, Headline } from '@/ui/Typography';
import { Suspense } from 'react';

// TODO: Bonus description of subscription benefits?
export default function SubscriptionPage() {
  return (
    <>
      <Headline styleAs="h1" uppercase>
        Subscription
      </Headline>
      <Copy>Lorem ipsum</Copy>
      <Suspense fallback={
        <>
          <InfoMessage type="loading" message="Loading subscription status...">
            <LoadingSkeleton type="card" />
          </InfoMessage>
        </>
      }>
        <Subscription />
      </Suspense>
    </>
  );
}
