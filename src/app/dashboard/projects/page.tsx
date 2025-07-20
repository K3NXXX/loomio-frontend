import { SITE_NAME } from '@/constants/seo.constants'
import type { Metadata } from 'next'
import { Projects } from './Projects'

export const metadata: Metadata = {
	title: 'Projects',
	description: `${SITE_NAME} projects page`,
}

export default function DashboardPage() {
	return <Projects />
}
