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
 
  const message = 'An unexpected error occurred.'

  return (
    <section className="section-base-space">
      <div className="flex flex-col items-center justify-center w-full space-y-4 rounded-md border border-border bg-card p-6 text-center text-typography shadow-elevated sm:p-8">
        <Headline styleAs="h3">Something went wrong</Headline>
        <Copy color="gray">{message}</Copy>
        <Button type="button" onClick={reset} label="Try again" variant="primary" />
        <Button type="button" href="/" label="Back to homepage" variant="secondary" />
      </div>
    </section>
  )
}