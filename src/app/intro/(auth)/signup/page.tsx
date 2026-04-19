import { SITE_NAME } from '@/constants/seo.constants'

import { SignUp } from './SignUp'

import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations('pages')

	return {
		title: t('registration'),
		description: `${SITE_NAME} registration page`,
	}
}

export default function SignUpPage() {
	return <SignUp />
}
