import { SITE_NAME } from '@/constants/seo.constants'

import { Intro } from './Intro'

import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations('pages')

	return {
		title: t('intro'),
		description: `${SITE_NAME} intro page`,
	}
}

export default function IntroPage() {
	return <Intro />
}
