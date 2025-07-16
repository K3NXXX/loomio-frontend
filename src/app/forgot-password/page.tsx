import { SITE_NAME } from '@/constants/seo.constants'
import { Metadata } from 'next'
import { ForgotPassword } from './ForgotPassword'

export const metadata: Metadata = {
	title: 'Forgot password',
	description: `${SITE_NAME} forgot password page`,
}

export default function ForgotPasswordPage() {
	return <ForgotPassword />
}
