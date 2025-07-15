import { SITE_NAME } from '@/constants/seo.constants'
import type { Metadata } from 'next'
import { SignUp } from './SignUp'

export const metadata: Metadata = {
	title: 'Registration',
	description: `${SITE_NAME} registration page`,
}

export default function SignUpPage() {
	return <SignUp />
}
