'use client'

import { UserChannelsSkeleton } from '@/components/skeletons/channels/UserChannelsSkeleton'
import { useGetUserChannels } from '@/hooks/channel/useGetUserChannels'
import { useTranslations } from 'next-intl'
import { UserChannelItem } from './UserChannelItem'
import { useState, useMemo, type RefObject } from 'react'

interface Props {
	search?: string
	onOpenChange?: (v: boolean) => void
	dropdownPortalRef?: RefObject<HTMLElement | null>
}

export default function UserChannelsList({
	search = '',
	onOpenChange,
	dropdownPortalRef,
}: Props) {
	const { userChannels, isError, isLoading } = useGetUserChannels()
	const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
	const t = useTranslations('common')

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
				<p className='text-red-500'>{t('channelsLoadError')}</p>
			</div>
		)
	}

	if (!filteredChannels.length) {
		return (
			<div className='flex justify-center p-6 text-sm text-muted-foreground text-center'>
				<p>{search ? t('noChannelsFound') : t('noChannels')}</p>
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
					onOpenChange={onOpenChange}
					dropdownPortalRef={dropdownPortalRef}
				/>
			))}
		</ul>
	)
}
