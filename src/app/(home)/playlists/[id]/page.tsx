import { SITE_NAME } from '@/constants/seo.constants'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import Playlist from './Playlist'

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations('pages')

	return {
		title: `Loomio | ${t('playlist')}`,
		description: `${SITE_NAME} playlist page`,
	}
}

export default function PlaylistPage() {
	return <Playlist />
}
