'use client'

import { HomeUIConfiguratorMenu } from '@/components/home/HomeUIConfiguratorMenu'
import { WorkplaceSkeleton } from '@/components/skeletons/workplace/WorkplaceSkeleton'
import { Button } from '@/components/ui/button'
import WorkplaceHeader from '@/components/workplace/WorkplaceHeader'
import { WorkplaceSidebar } from '@/components/workplace/WorkplaceSidebar'
import { useGetMe } from '@/hooks/auth/useGetMe'
import { useGetChannel } from '@/hooks/channel/useGetChannel'
import { useNotificationSocket } from '@/hooks/notification/useNotificationSocket'
import { useChannelStore } from '@/zustand/store/channelStore'
import { useGlobalStore } from '@/zustand/store/globalStore'
import { useParams } from 'next/navigation'
import React, { useEffect } from 'react'
import { IoMdSettings } from 'react-icons/io'

export default function WorkplaceLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const { username } = useParams<{ username: string }>()
	const cleanUsername = decodeURIComponent(username || '').replace(/^@/, '')
	const { channel, isLoading } = useGetChannel(cleanUsername)
	const { userData } = useGetMe()
	useNotificationSocket(userData?.id)
	const { setChannel, setLoading } = useChannelStore()

	const { toggleThemeMenuOpened } = useGlobalStore()

	useEffect(() => {
		setLoading(isLoading)
		if (channel) setChannel(channel)
	}, [channel, isLoading, setChannel, setLoading])

	if (isLoading || !channel) {
		return <WorkplaceSkeleton />
	}

	return (
		<div className='min-h-[50vh] flex flex-col'>
			<WorkplaceHeader channel={channel} />

			<div className='flex'>
				<WorkplaceSidebar channel={channel} />
				<main className='flex-1 min-w-0'>{children}</main>
			</div>

			<Button
				onClick={toggleThemeMenuOpened}
				className='w-[45px] h-[45px] p-0 fixed right-6 bottom-6 rounded-lg'
			>
				<IoMdSettings size={100} className='size-[25px]' />
			</Button>
			<HomeUIConfiguratorMenu />
		</div>
	)
}
