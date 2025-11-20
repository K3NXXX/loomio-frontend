import { SITE_NAME } from '@/constants/seo.constants'

import type { Metadata } from 'next'
import { DangerZone } from './DangerZone'

export const metadata: Metadata = {
	title: `${SITE_NAME} | Workplace`,
	description: `${SITE_NAME} danger zone page`,
}

export default function ContentPage() {
	return <DangerZone />
}
