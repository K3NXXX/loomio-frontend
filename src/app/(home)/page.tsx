import { SITE_NAME } from '@/constants/seo.constants'

import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Home } from './Home'

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations('pages')

	return {
		title: `Loomio | ${t('home')}`,
		description: `${SITE_NAME} home page`,
	}
}

export default function HomePage() {
	return <Home />
}
