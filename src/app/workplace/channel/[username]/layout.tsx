'use client'

import WorkplaceHeader from '@/components/workplace/WorkplaceHeader'
import { WorkplaceSidebar } from '@/components/workplace/WorkplaceSidebar'
import { useGetChannel } from '@/hooks/channel/useGetChannel'
import { useChannelStore } from '@/zustand/store/channelStore'
import { useParams } from 'next/navigation'
import React, { useEffect } from 'react'

export default function WorkplaceLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const { username } = useParams<{ username: string }>()
	const cleanUsername = decodeURIComponent(username || '').replace(/^@/, '')
	const { channel, isLoading } = useGetChannel(cleanUsername)
	const { setChannel, setLoading } = useChannelStore()

	useEffect(() => {
		setLoading(isLoading)
		if (channel) setChannel(channel)
	}, [channel, isLoading, setChannel, setLoading])

	if (isLoading || !channel) {
		return (
			<div className='min-h-[60vh] flex items-center justify-center text-muted-foreground'>
				Loading channel...
			</div>
		)
	}

	return (
		<div className='min-h-[50vh] flex flex-col'>
			<WorkplaceHeader channel={channel} />

			<div className='flex'>
				<WorkplaceSidebar channel={channel} />
				<main className='flex-1 min-w-0 p-4 md:p-6'>{children}</main>
			</div>
		</div>
	)
}
