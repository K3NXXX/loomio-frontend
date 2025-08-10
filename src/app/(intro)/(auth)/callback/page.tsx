import { NO_INDEX_PAGE } from '@/constants/seo.constants'

import { Callback } from './Callback'

import type { Metadata } from 'next'

export const metadata: Metadata = {
	...NO_INDEX_PAGE,
}
export default function AuthCallbackPage() {
	return <Callback />
}
