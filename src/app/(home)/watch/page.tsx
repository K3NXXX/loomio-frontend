import { SITE_NAME } from '@/constants/seo.constants'

import type { Metadata } from 'next'
import Watch from './Watch'

export const metadata: Metadata = {
	title: 'Watch',
	description: `${SITE_NAME} watch page`,
}

export default function WatchPage() {
	return <Watch />
}
