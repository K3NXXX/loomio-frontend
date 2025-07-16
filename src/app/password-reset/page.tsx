import { SITE_NAME } from '@/constants/seo.constants'
import { Metadata } from 'next'
import dynamic from 'next/dynamic'


const PasswordReset = dynamic(() => import('./PasswordReset'), { ssr: false })
export const metadata: Metadata = {
	title: 'Reset password',
	description: `${SITE_NAME} reset password page`,
}

export default function PasswordResetPage() {
	return <PasswordReset />
}
