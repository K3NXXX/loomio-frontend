import { NO_INDEX_PAGE } from '@/constants/seo.constants'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { CommentReportsHistory } from './CommentReportsHistory'

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations('pages')

	return {
		title: `Loomio | ${t('moderationPanel')}`,
		...NO_INDEX_PAGE,
	}
}

export default function CommentHistoryPage() {
	return <CommentReportsHistory />
}
