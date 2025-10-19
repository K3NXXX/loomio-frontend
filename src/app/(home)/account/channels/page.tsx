import { SITE_NAME } from '@/constants/seo.constants'
import type { Metadata } from 'next'
import { Channels } from './Channels'

export const metadata: Metadata = {
	title: `${SITE_NAME} | Channels`,
	description: `${SITE_NAME} channels page`,
}

export default function AccountPage() {
	return <Channels />
}
