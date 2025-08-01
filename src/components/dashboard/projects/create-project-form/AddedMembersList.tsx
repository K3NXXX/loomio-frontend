'use client'
import { IoClose } from 'react-icons/io5'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select'
import { PROJECT_MEMBER_ROLES } from '@/types/project.types'
import { getInitials } from '@/utils/get-initials'
import { truncateName } from '@/utils/truncateName'
import { useProjectStore } from '@/zustand/store/projectStore'

interface IAddedMembersListProps {
	searchValue: string
}

export function AddedMembersList({ searchValue }: IAddedMembersListProps) {
	const { selectedMembers, removeSelectedMember, updateRole } =
		useProjectStore()

	return (
		<>
			{searchValue.length < 1 && (
				<div className='pt-3 relative'>
					<p className='font-medium mb-2'>Added members: </p>
					<div className='absolute top-11 left-0 -right-2 h-51 overflow-y-auto  '>
						<ul className=' flex flex-col gap-2 pr-2'>
							{selectedMembers.map((member) => (
								<li
									className='flex items-center gap-3 bg-neutral-800 rounded-sm py-[6px] px-2 relative'
									key={member.id}
								>
									<Avatar>
										<AvatarImage src={member.avatarUrl ?? undefined} />
										<AvatarFallback>{getInitials(member.name)}</AvatarFallback>
									</Avatar>
									<div className='flex flex-col'>
										<p className='font-semibold text-sm'>
											{' '}
											{truncateName(member?.username || '')}
										</p>
										<p className='text-xs text-muted-foreground'>
											{' '}
											{truncateName(member?.name || '')}
										</p>
									</div>
									<div className='absolute top-[8px] right-3 flex items-center gap-3'>
										<Select
											value={member.role ?? PROJECT_MEMBER_ROLES.MEMBER}
											onValueChange={(role) =>
												updateRole(member.id, role as PROJECT_MEMBER_ROLES)
											}
										>
											<SelectTrigger className='w-[100px] h-[24px] px-2 py-0 data-[size=default]:h-8'>
												<SelectValue placeholder='Role' />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value={PROJECT_MEMBER_ROLES.VIEWER}>
													Viewer
												</SelectItem>
												<SelectItem value={PROJECT_MEMBER_ROLES.MEMBER}>
													Member
												</SelectItem>
												<SelectItem value={PROJECT_MEMBER_ROLES.ADMIN}>
													Admin
												</SelectItem>
											</SelectContent>
										</Select>
										<IoClose
											size={20}
											onClick={() => removeSelectedMember(member.id)}
											className='cursor-pointer'
										/>
									</div>
								</li>
							))}
						</ul>
					</div>
				</div>
			)}
		</>
	)
}
