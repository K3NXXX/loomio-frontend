import { SITE_NAME } from '@/constants/seo.constants'

import { Intro } from './Intro'

import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'Intro',
	description: `${SITE_NAME} intro page`,
}

export default function IntroPage() {
	return <Intro />
}
