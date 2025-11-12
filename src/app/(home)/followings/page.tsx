import { SITE_NAME } from '@/constants/seo.constants'
import type { Metadata } from 'next'
import { Followings } from './Followings'

export const metadata: Metadata = {
	title: 'Loomio | Followings',
	description: `${SITE_NAME} followings page`,
}

export default function FollowingsPage() {
	return <Followings />
}
