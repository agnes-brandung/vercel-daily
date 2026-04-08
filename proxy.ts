import { type NextRequest, NextResponse } from 'next/server'
 
export function proxy(request: NextRequest) {
  // biome-ignore lint/suspicious/noConsole: Intentional for request logging demonstration
  console.log(`[Proxy] ${request.method} ${request.nextUrl.pathname}`)
 
  // Continue to the route with added security headers
  const response = NextResponse.next()

  const vercelProtectionBypass = process.env.VERCEL_PROTECTION_BYPASS
  if (!vercelProtectionBypass) {
    throw new Error('VERCEL_PROTECTION_BYPASS is not set')
  }
 
  // Security headers
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
 
  return response
}
 
// Configure which paths run the proxy
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}