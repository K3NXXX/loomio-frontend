import { SITE_NAME } from '@/constants/seo.constants'

import type { Metadata } from 'next'
import { Project } from './Project'

export const metadata: Metadata = {
	title: 'Project',
	description: `${SITE_NAME} project page`,
}

export default function DashboardPage() {
	return <Project />
}
