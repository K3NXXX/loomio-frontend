import { SITE_NAME } from '@/constants/seo.constants'

import type { Metadata } from 'next'
import { Branding } from './Branding'

export const metadata: Metadata = {
	title: `${SITE_NAME} | Workplace`,
	description: `${SITE_NAME} workplace page`,
}

export default function BrandingPage() {
	return <Branding />
}
