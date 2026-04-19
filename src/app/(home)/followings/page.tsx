import { SITE_NAME } from '@/constants/seo.constants'
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Followings } from './Followings'

export async function generateMetadata(): Promise<Metadata> {
	const t = await getTranslations('pages')

	return {
		title: `Loomio | ${t('followings')}`,
		description: `${SITE_NAME} followings page`,
	}
}

export default function FollowingsPage() {
	return <Followings />
}
