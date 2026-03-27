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
      <div className="surface-elevated flex w-full flex-col items-center justify-center space-y-4 p-6 text-center text-typography sm:p-8">
        <Headline styleAs="h3">Something went wrong</Headline>
        <Copy color="gray">{message}</Copy>
        <Button type="button" onClick={reset} label="Try again" />
        <Button type="button" href="/" label="Back to homepage" variant="secondary" />
      </div>
    </section>
  )
}