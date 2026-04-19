import { SITE_NAME } from '@/constants/seo.constants'

import LogIn from './LogIn'

import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations('pages')

	return {
		title: t('login'),
		description: `${SITE_NAME} log in page`,
	}
}

export default function LogInPage() {
	return <LogIn />
}
