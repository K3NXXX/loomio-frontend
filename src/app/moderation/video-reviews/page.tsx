import { NO_INDEX_PAGE } from '@/constants/seo.constants'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { VideoReviews } from './VideoReviews'

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations('pages')

	return {
		title: `Loomio | ${t('moderationPanel')}`,
		...NO_INDEX_PAGE,
	}
}

export default function VideoReviewsPage() {
	return <VideoReviews />
}
