import { SITE_NAME } from '@/constants/seo.constants'

import type { Metadata } from 'next'
import EditAccount from './EditAccount'

export const metadata: Metadata = {
	title: 'Edit account',
	description: `${SITE_NAME} editing account page`,
}

export default function EditAccountPage() {
	return <EditAccount />
}
