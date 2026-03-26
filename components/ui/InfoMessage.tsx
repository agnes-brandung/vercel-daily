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
}

export function InfoMessage({ message, type }: InfoMessageProps) {
  const { border, copyColor } = typeStyles[type];
  return (
    <div className={cn('rounded-md border-2 p-4', border)}>
      <Copy color={copyColor}>{message}</Copy>
    </div>
  );
}
