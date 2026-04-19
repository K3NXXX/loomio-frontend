import { SITE_NAME } from '@/constants/seo.constants'

import { ForgotPassword } from './ForgotPassword'

import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations('pages')

	return {
		title: t('forgotPassword'),
		description: `${SITE_NAME} forgot password page`,
	}
}

export default function ForgotPasswordPage() {
	return <ForgotPassword />
}
