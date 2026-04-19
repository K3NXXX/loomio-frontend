import { SITE_NAME } from '@/constants/seo.constants'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { use } from 'react'
import { Search } from './Search'

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations('pages')

	return {
		title: `Loomio | ${t('search')}`,
		description: `${SITE_NAME} home page`,
	}
}

export default function SearchPage({
	searchParams,
}: {
	searchParams: Promise<{ query?: string }>
}) {
	const params = use(searchParams)
	const query = params.query || ''

	return <Search query={query} />
}
