import { SITE_NAME } from '@/constants/seo.constants'

import { ForgotPassword } from './ForgotPassword'

import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Forgot password',
	description: `${SITE_NAME} forgot password page`,
}

export default function ForgotPasswordPage() {
	return <ForgotPassword />
}
