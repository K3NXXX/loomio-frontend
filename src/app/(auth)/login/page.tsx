import { SITE_NAME } from '@/constants/seo.constants'
import type { Metadata } from 'next'
import LogIn from './LogIn'

export const metadata: Metadata = {
	title: 'Log in',
	description: `${SITE_NAME} log in page`,
}

export default function LogInPage() {
	return <LogIn />
}
