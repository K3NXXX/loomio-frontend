import { SITE_NAME } from '@/constants/seo.constants'

import type { Metadata } from 'next'
import { Content } from './Content'

export const metadata: Metadata = {
	title: `${SITE_NAME} | Workplace`,
	description: `${SITE_NAME} intro page`,
}

export default function ContentPage() {
	return <Content />
}
