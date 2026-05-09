import { SITE_NAME } from '@/constants/seo.constants'
import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: SITE_NAME,
		short_name: SITE_NAME,
		description: `${SITE_NAME} — videos and channels`,
		start_url: '/',
		scope: '/',
		display: 'standalone',
		orientation: 'any',
		background_color: '#0a0a0a',
		theme_color: '#0a0a0a',
		icons: [
			{
				src: '/favicon.svg',
				sizes: 'any',
				type: 'image/svg+xml',
				purpose: 'any',
			},
		],
	}
}
