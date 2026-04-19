import { Suspense } from 'react'

import dynamic from 'next/dynamic'

import { SITE_NAME } from '@/constants/seo.constants'

import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'

const PasswordReset = dynamic(() => import('./PasswordReset'))

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations('pages')

	return {
		title: t('resetPassword'),
		description: `${SITE_NAME} reset password page`,
	}
}

export default function PasswordResetPage() {
	return (
		<Suspense fallback={<div>Loading...</div>}>
			<PasswordReset />
		</Suspense>
	)
}
