import { SITE_NAME } from '@/constants/seo.constants'

import LogIn from './LogIn'

import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Log in',
	description: `${SITE_NAME} log in page`,
}

export default function LogInPage() {
	return <LogIn />
}
