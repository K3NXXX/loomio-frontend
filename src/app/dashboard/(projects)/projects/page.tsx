import { SITE_NAME } from '@/constants/seo.constants'

import { Projects } from './Projects'

import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Projects',
	description: `${SITE_NAME} projects page`,
}

export default function DashboardPage() {
	return <Projects />
}
