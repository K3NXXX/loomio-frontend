import { SITE_NAME } from '@/constants/seo.constants'

import type { Metadata } from 'next'
import { Home } from './Home'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { PAGES } from '@/constants/pages.constants'

export const metadata: Metadata = {
	title: 'Home',
	description: `${SITE_NAME} home page`,
}

export default async function HomePage() {
	const cookieStore = await cookies()
	const token = cookieStore.get('accessToken')?.value

	if (!token) {
		redirect(PAGES.LOGIN)
	}
	return <Home />
}
