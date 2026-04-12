'use client'

import { UserChannelsSkeleton } from '@/components/skeletons/channels/UserChannelsSkeleton'
import { useGetUserChannels } from '@/hooks/channel/useGetUserChannels'
import { UserChannelItem } from './UserChannelItem'
import { useState, useMemo } from 'react'

interface Props {
	search: string
}

export default function UserChannelsList({ search }: Props) {
	const { userChannels, isError, isLoading } = useGetUserChannels()
	const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

	const filteredChannels = useMemo(() => {
		if (!userChannels) return []
		return userChannels.filter((channel) =>
			channel.name.toLowerCase().includes(search.toLowerCase()),
		)
	}, [userChannels, search])

	if (isLoading) {
		return <UserChannelsSkeleton />
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

	if (!filteredChannels.length) {
		return (
			<div className='flex justify-center p-6 text-sm text-muted-foreground text-center'>
				<p>{search ? 'No channels found. ' : 'No channels yet. '}</p>
			</div>
		)
	}

	return (
		<ul className='flex flex-col w-full max-h-[60vh] overflow-y-auto divide-y divide-white/5'>
			{filteredChannels.map((channel) => (
				<UserChannelItem
					key={channel.id}
					channel={channel}
					activeDropdown={activeDropdown}
					setActiveDropdown={setActiveDropdown}
				/>
			))}
		</ul>
	)
}
