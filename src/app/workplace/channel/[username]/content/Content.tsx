'use client'

import { WorkplaceChannelVideosList } from '@/components/workplace/WorkplaceChannelVideosList'
import { useGetChannelStudioVideos } from '@/hooks/videos/useGetChannelStudioVideos'
import { useChannelStore } from '@/zustand/store/channelStore'
import { useTranslations } from 'next-intl'

export function Content() {
	const { channel } = useChannelStore()
	const { videos } = useGetChannelStudioVideos(channel?.id || '')
	const t = useTranslations('workplaceContent')
	const tDashboard = useTranslations('workplaceDashboard')

	if (!videos) {
		return (
			<div className='p-10 text-muted-foreground text-center'>
				{tDashboard('loadingChannel')}
			</div>
		)
	}

	return (
		<div className='py-10 px-5 flex flex-col items-start'>
			<h1 className='text-lg min-[400px]:text-xl min-[980px]:text-[25px] font-bold mb-5 min-[980px]:mb-8 tracking-tight text-left w-full'>
				{t('pageTitle')}
			</h1>
			<WorkplaceChannelVideosList videos={videos} />
		</div>
	)
}
