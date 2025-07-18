import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { Metadata } from 'next'
import { SITE_NAME } from '@/constants/seo.constants'

const PasswordReset = dynamic(() => import('./PasswordReset'))

export const metadata: Metadata = {
  title: 'Reset password',
  description: `${SITE_NAME} reset password page`,
}

export default function PasswordResetPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PasswordReset />
    </Suspense>
  )
}
