'use client'

import { UserChannelsSkeleton } from '@/components/skeletons/UserChannelsSkeleton'
import { useGetUserChannels } from '@/hooks/channel/useGetUserChannels'
import { UserChannelItem } from './UserChannelItem'

export default function UserChannelsList() {
	const { userChannels, isError, isLoading } = useGetUserChannels()

	if (isLoading) {
		return (
			<ul className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
				{Array.from({ length: 6 }).map((_, index) => (
					<UserChannelsSkeleton key={index} />
				))}
			</ul>
		)
	}

	if (isError) {
		return (
			<div className='flex justify-center p-6'>
				<p className='text-red-500'>
					Failed to load channels. Please try again later.
				</p>
			</div>
		)
	}

	if (!userChannels || userChannels.length === 0) {
		return (
			<div className='flex justify-center p-6'>
				<p className='text-neutral-600 dark:text-neutral-400'>
					No channels yet
				</p>
			</div>
		)
	}

	return (
		<ul className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
			{userChannels?.map((channel) => (
				<UserChannelItem key={channel.id} channel={channel} />
			))}
		</ul>
	)
}
