import { SITE_NAME } from '@/constants/seo.constants'
import { requireAuthCookie } from '@/lib/server-auth'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Playlists } from './Playlists'

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations('pages')

	return {
		title: `Loomio | ${t('playlists')}`,
		description: `${SITE_NAME} playlists page`,
	}
}

export default async function PlaylistsPage() {
	await requireAuthCookie()
	return <Playlists />
}
