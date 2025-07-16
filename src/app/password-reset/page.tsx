import { SITE_NAME } from '@/constants/seo.constants'
import { Metadata } from 'next'
import { PasswordReset } from './PasswordReset'

export const metadata: Metadata = {
	title: 'Reset password',
	description: `${SITE_NAME} reset password page`,
}

export default function PasswordResetPage() {
	return <PasswordReset />
}
