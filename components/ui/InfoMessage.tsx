import { cn } from '@/utils/cn';

import { Copy } from './Typography';

export type InfoMessageType = 'loading' | 'error' | 'info' | 'success';

const typeStyles: Record<
  InfoMessageType,
  { border: string; copyColor: 'loading' | 'error' | 'green' | 'yellow' }
> = {
  loading: { border: 'border-loading', copyColor: 'loading' },
  success: { border: 'border-green', copyColor: 'green' },
  error: { border: 'border-error', copyColor: 'error' },
  info: { border: 'border-yellow', copyColor: 'yellow' },
};

export interface InfoMessageProps {
  message: string;
  type: InfoMessageType;
  children?: React.ReactNode;
}

export function InfoMessage({ message, type, children }: InfoMessageProps) {
  const { border, copyColor } = typeStyles[type];
  return (
    <div className={cn('w-full rounded-md border-2 p-4 space-y-2', border)}>
      <Copy role={type === "error" ? "alert" : "status"} color={copyColor}>{message}</Copy>
      {children ? children : null}
    </div>
  );
}
