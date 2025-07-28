import { SITE_NAME } from '@/constants/seo.constants'

import { Dashboard } from './Dashboard'

import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Dashboard',
	description: `${SITE_NAME} dashboard page`,
}

export default function DashboardPage() {
	return <Dashboard />
}
