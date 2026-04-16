import { cn } from '@/utils/cn';

export function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn('size-4 shrink-0', className)}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="m9 6 6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
