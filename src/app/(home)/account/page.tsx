import { SITE_NAME } from '@/constants/seo.constants'

import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import Account from './Account'

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations('pages')

	return {
		title: `Loomio | ${t('account')}`,
		description: `${SITE_NAME} account page`,
	}
}

export default function AccountPage() {
	return <Account />
}
