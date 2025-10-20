import { SITE_NAME } from '@/constants/seo.constants'
import type { Metadata } from 'next'
import { Channel } from './Channel'

export function generateMetadata({
	params,
}: {
	params: { username: string }
}): Metadata {
	const username = decodeURIComponent(params.username)

	return {
		title: `${SITE_NAME} | @${username.replace(/^@/, '')}`,
		description: `Channel page for ${username} on ${SITE_NAME}`,
	}
}

export default function ChannelPage() {
	return <Channel />
}
