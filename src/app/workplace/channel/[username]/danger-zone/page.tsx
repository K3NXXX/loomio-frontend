import { SITE_NAME } from '@/constants/seo.constants'

import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { DangerZone } from './DangerZone'

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations('pages')

	return {
		title: `${SITE_NAME} | ${t('workplace')}`,
		description: `${SITE_NAME} danger zone page`,
	}
}

export default function ContentPage() {
	return <DangerZone />
}
