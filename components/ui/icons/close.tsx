import { cn } from '@/utils/cn';

export function CloseIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cn('size-6 shrink-0', className)}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9 9l14 14M23 9L9 23"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="2.5"
      />
    </svg>
  )
}
