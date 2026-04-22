import { SITE_NAME } from '@/constants/seo.constants'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { PlaylistsClient } from './ChannelPlaylists'

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations('pages')

	return {
		title: `${SITE_NAME} | ${t('creator')}`,
		description: `${SITE_NAME} workplace page`,
	}
}

export default function PlaylistsPage() {
	return <PlaylistsClient />
}
