import { NO_INDEX_PAGE } from '@/constants/seo.constants'
import type { Metadata } from 'next'
import { VideoReviews } from './VideoReviews'

export const metadata: Metadata = {
	title: 'Loomio | Moderation panel',
	...NO_INDEX_PAGE,
}

export default function VideoReviewsPage() {
	return <VideoReviews />
}
