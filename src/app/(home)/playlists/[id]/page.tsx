import { SITE_NAME } from '@/constants/seo.constants'
import type { Metadata } from 'next'
import Playlist from './Playlist'

export const metadata: Metadata = {
	title: 'Loomio | Playlist',
	description: `${SITE_NAME} playlist page`,
}

export default function PlaylistPage() {
	return <Playlist />
}
