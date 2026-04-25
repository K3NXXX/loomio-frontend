import { SITE_NAME } from '@/constants/seo.constants'
import type { Metadata } from 'next'
import Terms from './Terms'

export const metadata: Metadata = {
	title: `Loomio | Terms & Privacy`,
	description: `${SITE_NAME} terms of service and privacy policy`,
}

export default function TermsPage() {
	return <Terms />
}
