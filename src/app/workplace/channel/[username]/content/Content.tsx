'use client'

import { WorkplaceChannelVideosList } from '@/components/workplace/WorkplaceChannelVideosList'
import { useChannelStore } from '@/zustand/store/channelStore'

export function Content() {
	const { channel } = useChannelStore()

	if (!channel) {
		return (
			<div className='p-10 text-muted-foreground text-center'>
				Loading channel data...
			</div>
		)
	}

	return (
		<div className='p-10 flex flex-col items-start'>
			<h1 className='text-[25px] font-bold mb-8 tracking-tight text-left w-full'>
				Content on your channel
			</h1>
			<WorkplaceChannelVideosList videos={channel.videos} />
		</div>
	)
}
