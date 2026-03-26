import { InfoMessage } from '@/components/ui/InfoMessage';
import LoadingSkeleton from '@/components/ui/LoadingSkeleton';

export default function Loading() {
  return (
    <div className="mx-auto w-full flex flex-col items-center justify-center max-w-5xl py-block">   
      <InfoMessage type="loading" message="Loading article…">
        <LoadingSkeleton />
      </InfoMessage>
    </div>
  )
}