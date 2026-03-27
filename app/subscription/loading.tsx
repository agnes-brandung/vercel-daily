import { InfoMessage } from '@/components/ui/InfoMessage';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';

export default function Loading() {
  return (
    <InfoMessage type="loading" message="Loading subscription status...">
      <LoadingSkeleton />
    </InfoMessage>
  )
}