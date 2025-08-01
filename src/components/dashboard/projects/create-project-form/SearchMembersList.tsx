import { SearchProjectMembersSkeleton } from '@/components/skeletons/SearchProjectMembersSkeleton'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getInitials } from '@/utils/get-initials'
import { truncateName } from '@/utils/truncateName'
import { useProjectStore } from '@/zustand/store/projectStore'
import { useVirtualizer } from '@tanstack/react-virtual'

import {
	PROJECT_MEMBER_ROLES,
	type ISearchProjectMembersResponse,
} from '@/types/project.types'
import { useEffect, useMemo, useRef } from 'react'

interface ISearchMembersListProps {
	members: ISearchProjectMembersResponse[]
	searchProjectMembersLoading: boolean
	setSearchValue: (searchValue: string) => void
	setIsSearchListVisible: (value: boolean) => void
	onLoadMore: () => void
}

const ITEM_GAP = 8

export function SearchMembersList({
	members,
	searchProjectMembersLoading,
	setSearchValue,
	setIsSearchListVisible,
	onLoadMore,
}: ISearchMembersListProps) {
	const { addSelectedMember } = useProjectStore()
	const listParentRef = useRef<HTMLDivElement>(null)

	const handleAddMember = (member: ISearchProjectMembersResponse) => {
		addSelectedMember({
			...member,
			role: PROJECT_MEMBER_ROLES.MEMBER,
		})
		setSearchValue('')
		setIsSearchListVisible(false)
	}

	const virtualCount = useMemo(() => {
		return members.length + (searchProjectMembersLoading ? 2 : 0)
	}, [members.length, searchProjectMembersLoading])

	const rowVirtualizer = useVirtualizer({
		count: virtualCount,
		getScrollElement: () => listParentRef.current,
		estimateSize: () => 48,
		overscan: 5,
	})

	useEffect(() => {
		const scrollElement = listParentRef.current
		if (!scrollElement) return

		const handleScroll = () => {
			const { scrollTop, scrollHeight, clientHeight } = scrollElement
			const distanceFromBottom = scrollHeight - scrollTop - clientHeight

			if (distanceFromBottom < 100 && !searchProjectMembersLoading) {
				onLoadMore()
			}
		}

		scrollElement.addEventListener('scroll', handleScroll)
		return () => scrollElement.removeEventListener('scroll', handleScroll)
	}, [onLoadMore, searchProjectMembersLoading])

	return (
		<div
			ref={listParentRef}
			className='absolute top-13 left-0 -right-2 h-58 overflow-y-auto pr-2 z-10 bg-[#121212]'
		>
			<ul
				style={{
					height: `${rowVirtualizer.getTotalSize() + ITEM_GAP * (virtualCount - 1)}px`,
				}}
				className='relative'
			>
				{members.length === 0 && !searchProjectMembersLoading ? (
					<li className='text-center text-sm text-muted-foreground py-4'>
						Users not found
					</li>
				) : (
					rowVirtualizer.getVirtualItems().map((virtualItem) => {
						const isLoadingItem = virtualItem.index >= members.length

						if (isLoadingItem) {
							return (
								<div
									key={`skeleton-${virtualItem.index}`}
									style={{
										position: 'absolute',
										top: 0,
										left: 0,
										width: '100%',
										height: virtualItem.size,
										transform: `translateY(${virtualItem.start + virtualItem.index * ITEM_GAP}px)`,
									}}
								>
									<SearchProjectMembersSkeleton />
								</div>
							)
						}

						const member = members[virtualItem.index]
						if (!member) return null

						return (
							<li
								key={member.id}
								onClick={() => handleAddMember(member)}
								className='flex items-center gap-3 bg-neutral-800 cursor-pointer rounded-sm py-[6px] px-2'
								style={{
									position: 'absolute',
									top: 0,
									left: 0,
									width: '100%',
									height: virtualItem.size,
									transform: `translateY(${virtualItem.start + virtualItem.index * ITEM_GAP}px)`,
								}}
							>
								<Avatar>
									<AvatarImage src={member.avatarUrl ?? undefined} />
									<AvatarFallback>{getInitials(member.name)}</AvatarFallback>
								</Avatar>
								<div className='flex flex-col'>
									<p className='font-semibold text-sm'>
										{truncateName(member?.username || '')}
									</p>
									<p className='text-xs text-muted-foreground'>
										{truncateName(member?.name || '')}
									</p>
								</div>
							</li>
						)
					})
				)}
			</ul>
		</div>
	)
}
