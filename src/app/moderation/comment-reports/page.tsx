import { NO_INDEX_PAGE } from '@/constants/seo.constants'
import type { Metadata } from 'next'
import { CommentReports } from './CommentReports'

export const metadata: Metadata = {
	title: 'Loomio | Moderation panel',
	...NO_INDEX_PAGE,
}

export default function CommentReportsPage() {
	return <CommentReports />
}
