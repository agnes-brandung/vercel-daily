'use client'
 
import { useEffect } from 'react'
import ArticleError from '@/components/Article/ArticleError'
 
export default function Error({
  error,
}: {
  error: Error & { digest?: string }
}) {
  useEffect(() => {
    // biome-ignore lint/suspicious/noConsole: Intentional for error reporting demonstration
    console.error('Error boundary caught on article detail page:', error)
  }, [error])

  return (
    <ArticleError
      headline="Something went wrong while loading this article..."
      description="An unexpected error occurred while loading this article. Please Please try again later."
      reset={() => {
        window.location.reload();
      }}
    />
  )
}