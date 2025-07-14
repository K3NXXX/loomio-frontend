import { SITE_NAME } from '@/constants/seo.constants'
import { Metadata } from 'next'
import { Intro } from './Intro'

export const metadata: Metadata = {
	title: 'Intro',
	description: `${SITE_NAME} log in page`,
}

export default function IntroPage() {
	return <Intro />
}
