import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'

import { getInitials } from '@/utils/get-initials'

import { SearchProjectMembersSkeleton } from '@/components/skeletons/SearchProjectMembersSkeleton'
import type { ISearchProjectMembersResponse } from '@/types/project.types'
import { useProjectStore } from '@/zustand/store/projectStore'

interface ISearchMembersListProps {
	members: ISearchProjectMembersResponse[]
	searchProjectMembersLoading: boolean
	setSearchValue: (searchValue: string) => void
	setIsSearchListVisible: (value: boolean) => void
}
export function SearchMembersList({
	members,
	searchProjectMembersLoading,
	setSearchValue,
	setIsSearchListVisible,
}: ISearchMembersListProps) {
	const { addSelectedMember } = useProjectStore()

	const handleAddMember = (member: ISearchProjectMembersResponse) => {
		addSelectedMember(member)
		setSearchValue('')
		setIsSearchListVisible(false)
	}
	return (
		<div className='absolute top-13 left-0 -right-2 h-58 overflow-y-auto pr-2 z-10 bg-[#121212]'>
			<ul className='flex flex-col gap-2'>
				{searchProjectMembersLoading ? (
					[...new Array(4)].map((_, index) => (
						<SearchProjectMembersSkeleton key={index} />
					))
				) : members.length === 0 ? (
					<li className='text-center text-sm text-muted-foreground py-4'>
						Users not found
					</li>
				) : (
					members.map((member) => (
						<li
							onClick={() => handleAddMember(member)}
							className='flex items-center gap-3 bg-neutral-800 cursor-pointer rounded-sm py-[6px] px-2'
							key={member.id}
						>
							<Avatar>
								<AvatarImage src={member.avatarUrl ?? undefined} />
								<AvatarFallback>{getInitials(member.fullName)}</AvatarFallback>
							</Avatar>
							<div className='flex flex-col'>
								<p className='font-semibold text-sm'>{member?.username}</p>
								<p className='text-xs text-muted-foreground'>
									{member?.fullName}
								</p>
							</div>
						</li>
					))
				)}
			</ul>
		</div>
	)
}
