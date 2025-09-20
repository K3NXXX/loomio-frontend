import { SITE_NAME } from '@/constants/seo.constants'

import LogIn from './LogIn'

import { PAGES } from '@/constants/pages.constants'
import type { Metadata } from 'next'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
	title: 'Log in',
	description: `${SITE_NAME} log in page`,
}

export default async function LogInPage() {
	const cookieStore = await cookies()
	const token = cookieStore.get('accessToken')?.value

	if (token) {
		redirect(PAGES.HOME)
	}

	return <LogIn />
}
