import { NO_INDEX_PAGE } from '@/constants/seo.constants'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { CommentReports } from './CommentReports'

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations('pages')

	return {
		title: `Loomio | ${t('moderationPanel')}`,
		...NO_INDEX_PAGE,
	}
}

export default function CommentReportsPage() {
	return <CommentReports />
}
