import { SITE_NAME } from '@/constants/seo.constants'
import type { Metadata } from 'next'
import { Channel } from './Channel'

export async function generateMetadata({
	params,
}: {
	params: Promise<{ username: string }>
}): Promise<Metadata> {
	const { username } = await params
	const decodedUsername = decodeURIComponent(username)

	return {
		title: `${SITE_NAME} | @${decodedUsername.replace(/^@/, '')}`,
		description: `Channel page for ${decodedUsername} on ${SITE_NAME}`,
	}
}

export default function ChannelPage() {
	return <Channel />
}
