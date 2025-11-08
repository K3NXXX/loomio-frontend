import { SITE_NAME } from '@/constants/seo.constants'
import type { Metadata } from 'next'
import { Playlists } from './Playlists'

export const metadata: Metadata = {
	title: 'Loomio | Playlists',
	description: `${SITE_NAME} playlists page`,
}

export default function PlaylistsPage() {
	return <Playlists />
}
