import type { Metadata } from 'next'
import { use } from 'react'
import { Search } from './Search'
import { SITE_NAME } from '@/constants/seo.constants'

export const metadata: Metadata = {
	title: 'Loomio | Search data',
	description: `${SITE_NAME} home page`,
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
