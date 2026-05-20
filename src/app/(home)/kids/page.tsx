import { SITE_NAME } from '@/constants/seo.constants'

import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Kids } from './Kids'

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations('pages')

	return {
		title: `Loomio | ${t('kids')}`,
		description: `${SITE_NAME} — ${t('kids')}`,
	}
}

export default function KidsPage() {
	return <Kids />
}
