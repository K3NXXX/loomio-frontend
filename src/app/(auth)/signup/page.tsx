import { SITE_NAME } from '@/constants/seo.constants'

import { SignUp } from './SignUp'

import { PAGES } from '@/constants/pages.constants'
import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
	title: 'Registration',
	description: `${SITE_NAME} registration page`,
}

export default async function SignUpPage() {
	const cookieStore = await cookies()
	const token = cookieStore.get('accessToken')?.value

	if (token) {
		redirect(PAGES.HOME)
	}
	return <SignUp />
}
