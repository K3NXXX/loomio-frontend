'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getInitials } from '@/utils/get-initials'
import { useProjectStore } from '@/zustand/store/projectStore'
import { IoClose } from 'react-icons/io5'
import { RxDotsHorizontal } from 'react-icons/rx'

export function AddedMembersList() {
	const { selectedMembers, removeSelectedMember } = useProjectStore()

	return (
		<div className='pt-3 '>
			<p className='font-medium mb-2'>Added members: </p>
			<div className='h-34 overflow-y-auto  '>
				<ul className='flex flex-col gap-2'>
					{selectedMembers.map((member) => (
						<li
							className='flex items-center gap-3 bg-neutral-800 rounded-sm py-[6px] px-2 relative'
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
							<div className='absolute top-4 right-3 flex items-center gap-3'>
								<RxDotsHorizontal className='cursor-pointer' size={20} />
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
	)
}
