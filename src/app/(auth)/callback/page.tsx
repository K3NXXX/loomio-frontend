import { NO_INDEX_PAGE } from '@/constants/seo.constants'

import { Callback } from './Callback'

import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations('pages')

	return {
		title: t('oauthRegistration'),
		...NO_INDEX_PAGE,
	}
}
export default function AuthCallbackPage() {
	return <Callback />
}
