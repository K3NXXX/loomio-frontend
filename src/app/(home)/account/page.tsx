import { SITE_NAME } from '@/constants/seo.constants'

import type { Metadata } from 'next'
import Account from './Account'

export const metadata: Metadata = {
	title: 'Loomio | Account',
	description: `${SITE_NAME} account page`,
}

export default function AccountPage() {
	return <Account />
}
