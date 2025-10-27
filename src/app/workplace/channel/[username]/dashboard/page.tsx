import { SITE_NAME } from '@/constants/seo.constants'

import type { Metadata } from 'next'
import { Dashboard } from './Dashboard'

export const metadata: Metadata = {
	title: `${SITE_NAME} | Workplace`,
	description: `${SITE_NAME} workplace page`,
}

export default function DashboardPage() {
	return <Dashboard />
}
