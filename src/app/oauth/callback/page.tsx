import { NO_INDEX_PAGE, SITE_NAME } from '@/constants/seo.constants'
import { Metadata } from 'next'
import OAuthCallback from './OAuth'

export const metadata: Metadata = {
	title: 'OAuth',
	description: `${SITE_NAME} oauth page`,
	...NO_INDEX_PAGE,
}

export default function PasswordResetPage() {
	return <OAuthCallback />
}
