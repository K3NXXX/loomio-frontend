import { SITE_NAME } from '@/constants/seo.constants'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import Watch from './Watch'

export async function generateMetadata({
	searchParams,
}: {
	searchParams: Promise<{ v?: string }>
}): Promise<Metadata> {
	const t = await getTranslations('pages')
	const { v } = await searchParams
	const videoId = v

	if (!videoId) {
		return {
			title: `${t('watch')} | ${SITE_NAME}`,
			description: `${SITE_NAME} watch page`,
		}
	}

	const res = await fetch(
		`${process.env.NEXT_PUBLIC_API_URL}/videos/public/${videoId}`,
		{ next: { revalidate: 60 } },
	)

	if (!res.ok) {
		return {
			title: `${t('videoNotFound')} | ${SITE_NAME}`,
			description: `This video does not exist on ${SITE_NAME}`,
		}
	}

	const video = await res.json()

	return {
		title: `${video.title}`,
		description: video.description
			? video.description.slice(0, 150)
			: `${SITE_NAME} watch page`,
		openGraph: {
			title: `${video.title} | ${SITE_NAME}`,
			description: video.description,
			images: [video.thumbnailFile],
		},
	}
}

export default function WatchPage() {
	return <Watch />
}
