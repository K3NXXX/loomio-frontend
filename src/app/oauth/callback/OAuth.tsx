'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useOAuth } from '@/hooks/auth/useOAuth'

export default function OAuthCallback() {
  const pathname = usePathname() 

  const match = pathname.match(/auth\/([^/]+)\/callback/)
  const provider = match?.[1] || 'google'

  const data = useOAuth(provider)

  useEffect(() => {
    if (data?.redirectUrl) {
      window.location.href = data.redirectUrl
    }
  }, [data])

  return <p>Завершення авторизації через {provider}...</p>
}
