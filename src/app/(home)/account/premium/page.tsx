import { SITE_NAME } from '@/constants/seo.constants'

import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Premium } from './Premium'

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations()

	return {
		title: `Loomio | ${t('premium.label')}`,
		description: `${SITE_NAME} account page`,
	}
}

export default function AccountPage() {
	return <Premium />
}
