import { cn } from '@/utils/cn';

interface ArrowRightIconProps {
  className?: string;
}

export function ArrowRightIcon({ className }: ArrowRightIconProps) {
  return (
    <svg
      className={cn('size-5 shrink-0', className)}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <path
        d="M5 12h14m0 0-6-6m6 6-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
