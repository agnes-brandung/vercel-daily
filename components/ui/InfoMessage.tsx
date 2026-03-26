import { cn } from '@/utils/cn';

import { Copy } from './Typography';

export type InfoMessageType = 'loading' | 'error' | 'info';

const typeStyles: Record<
  InfoMessageType,
  { border: string; copyColor: 'loading' | 'error' | 'green' }
> = {
  loading: { border: 'border-loading', copyColor: 'loading' },
  error: { border: 'border-error', copyColor: 'error' },
  info: { border: 'border-green', copyColor: 'green' },
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
      <Copy color={copyColor}>{message}</Copy>
      {children ? children : null}
    </div>
  );
}
