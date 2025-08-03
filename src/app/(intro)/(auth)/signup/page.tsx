import { SITE_NAME } from '@/constants/seo.constants'

import { SignUp } from './SignUp'

import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Registration',
	description: `${SITE_NAME} registration page`,
}

export default function SignUpPage() {
	return <SignUp />
}
