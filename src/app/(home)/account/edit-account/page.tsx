import { SITE_NAME } from '@/constants/seo.constants'

import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import EditAccount from './EditAccount'

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations('pages')

	return {
		title: `Loomio | ${t('editAccount')}`,
		description: `${SITE_NAME} editing account page`,
	}
}

export default function EditAccountPage() {
	return <EditAccount />
}
