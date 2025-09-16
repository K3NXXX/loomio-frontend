import { SITE_NAME } from '@/constants/seo.constants'

import type { Metadata } from 'next'
import { Home } from './Home'

export const metadata: Metadata = {
	title: 'Home',
	description: `${SITE_NAME} home page`,
}

export default function PasswordResetPage() {
	return <Home />
}
