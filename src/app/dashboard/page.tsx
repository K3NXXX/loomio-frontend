import { SITE_NAME } from '@/constants/seo.constants'
import type { Metadata } from 'next'
import { Dashboard } from './Dashboard'

export const metadata: Metadata = {
	title: 'Dashboard',
	description: `${SITE_NAME} dashboard page`,
}

export default function DashboardPage() {
	return <Dashboard />
}
