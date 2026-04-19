import { SITE_NAME } from '@/constants/seo.constants'

import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Content } from './Content'

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations('pages')

	return {
		title: `${SITE_NAME} | ${t('workplace')}`,
		description: `${SITE_NAME} intro page`,
	}
}

export default function ContentPage() {
	return <Content />
}
