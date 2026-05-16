'use client'

import { HomeUIConfiguratorMenu } from '@/components/home/HomeUIConfiguratorMenu'
import { WorkplaceSkeleton } from '@/components/skeletons/workplace/WorkplaceSkeleton'
import { Button } from '@/components/ui/button'
import WorkplaceHeader from '@/components/workplace/WorkplaceHeader'
import { WorkplaceSidebar } from '@/components/workplace/WorkplaceSidebar'
import { PAGES } from '@/constants/pages.constants'
import { useGetMe } from '@/hooks/auth/useGetMe'
import { useGetChannel } from '@/hooks/channel/useGetChannel'
import { useNotificationSocket } from '@/hooks/notification/useNotificationSocket'
import { useChannelStore } from '@/zustand/store/channelStore'
import { cn } from '@/lib/utils'
import { useGlobalStore } from '@/zustand/store/globalStore'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import React, { useEffect } from 'react'
import { IoMdSettings } from 'react-icons/io'

export default function WorkplaceLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const tLayout = useTranslations('workplaceChannelLayout')
	const { username } = useParams<{ username: string }>()
	const cleanUsername = decodeURIComponent(username || '').replace(/^@/, '')
	const { channel, isLoading, isError, refetch } = useGetChannel(
		cleanUsername,
		{ scope: 'studio' },
	)
	const { userData } = useGetMe()
	useNotificationSocket(userData?.id)
	const { setChannel, setLoading } = useChannelStore()

	const { toggleThemeMenuOpened, homeSidebarDockSide } = useGlobalStore()

	useEffect(() => {
		setLoading(isLoading)
		if (channel) setChannel(channel)
	}, [channel, isLoading, setChannel, setLoading])

	if (isError) {
		return (
			<div className='min-h-[50vh] flex flex-col items-center justify-center gap-4 px-6 py-16 text-center'>
				<p className='text-muted-foreground max-w-md'>{tLayout('loadFailed')}</p>
				<div className='flex flex-wrap items-center justify-center gap-2'>
					<Button type='button' variant='default' onClick={() => refetch()}>
						{tLayout('retry')}
					</Button>
					<Button type='button' variant='outline' asChild>
						<Link href={PAGES.HOME}>{tLayout('backHome')}</Link>
					</Button>
				</div>
			</div>
		)
	}

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
				className={cn(
					'w-[45px] h-[45px] p-0 fixed bottom-6 rounded-lg',
					homeSidebarDockSide === 'right' ? 'left-6' : 'right-6',
				)}
			>
				<IoMdSettings size={100} className='size-[25px]' />
			</Button>
			<HomeUIConfiguratorMenu />
		</div>
	)
}
