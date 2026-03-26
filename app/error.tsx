'use client'
 
import { useEffect } from 'react'
import Button from '@/components/ui/Button'
import { Copy, Headline } from '@/ui/Typography'
 
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // biome-ignore lint/suspicious/noConsole: Intentional for error reporting demonstration
    console.error('Root error boundary caught:', error)
  }, [error])
 
  const message = error.message?.trim() || 'An unexpected error occurred.'

  return (
    <section className="section-base-space">
      <div className="mx-auto flex min-h-[50vh] w-full max-w-2xl items-center justify-center">
        <div className="w-full space-y-4 rounded-xl border border-border bg-card p-6 text-center text-typography shadow-elevated sm:p-8">
          <Headline styleAs="h3">Something went wrong</Headline>
          <Copy color="gray">{message}</Copy>
        {error.digest && (
            <Copy size="xs" color="lightGray" className="font-mono">
              Error ID: {error.digest}
            </Copy>
        )}
          <div className="pt-1">
            <Button type="button" onClick={reset} label="Try again" variant="primary" />
          </div>
        </div>
      </div>
    </section>
  )
}