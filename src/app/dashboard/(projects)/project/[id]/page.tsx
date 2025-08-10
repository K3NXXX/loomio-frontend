import { SITE_NAME } from '@/constants/seo.constants'

import { Project } from './Project'

import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Project',
	description: `${SITE_NAME} project page`,
}

export default function DashboardPage() {
	return <Project />
}
