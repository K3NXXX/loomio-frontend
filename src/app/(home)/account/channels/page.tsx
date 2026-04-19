import { SITE_NAME } from '@/constants/seo.constants'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Channels } from './Channels'

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations('pages')

	return {
		title: `${SITE_NAME} | ${t('channels')}`,
		description: `${SITE_NAME} channels page`,
	}
}

export default function AccountPage() {
	return <Channels />
}
