import { SITE_NAME } from '@/constants/seo.constants'

import { SignUp } from './SignUp'

import { PAGES } from '@/constants/pages.constants'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations('pages')

	return {
		title: t('registration'),
		description: `${SITE_NAME} registration page`,
	}
}

export default async function SignUpPage() {
	const cookieStore = await cookies()
	const token = cookieStore.get('accessToken')?.value

	if (token) {
		redirect(PAGES.HOME)
	}
	return <SignUp />
}
