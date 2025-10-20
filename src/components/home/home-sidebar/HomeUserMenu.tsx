'use client'
import { ChevronsUpDown } from 'lucide-react'
import { FaRegCircleUser } from 'react-icons/fa6'
import { FiBell } from 'react-icons/fi'
import { LuCrown } from 'react-icons/lu'
import { MdLogout } from 'react-icons/md'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { PAGES } from '@/constants/pages.constants'
import { useGetMe } from '@/hooks/auth/useGetMe'
import { useLogout } from '@/hooks/auth/useLogout'
import { getInitials } from '@/utils/get-initials'
import { truncateName } from '@/utils/truncateName'
import { useGlobalStore } from '@/zustand/store/globalStore'
import Link from 'next/link'
import { MdOutlineVideoLibrary } from 'react-icons/md'

export function HomeUserMenu() {
	const { userData } = useGetMe()
	const { logout } = useLogout()
	const { isSidebarCollapsed } = useGlobalStore()

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<div
					className={`${isSidebarCollapsed ? 'hover:bg-muted transition-colors duration-300 ease-in-out rounded-md cursor-pointer' : 'flex items-center justify-between w-full hover:bg-muted transition-colors rounded-md gap-1 cursor-pointer p-2 ml-2'}`}
				>
					<div className='flex items-center gap-3'>
						<Avatar className='h-9 w-9'>
							<AvatarImage src={userData?.avatarUrl} />
							<AvatarFallback>{getInitials(userData?.name)}</AvatarFallback>
						</Avatar>
						{!isSidebarCollapsed && (
							<div className='flex flex-col overflow-hidden'>
								<p className='font-semibold text-sm truncate'>
									{userData?.username}
								</p>
								<p className='text-xs text-muted-foreground truncate'>
									{truncateName(userData?.email || '', 21)}
								</p>
							</div>
						)}
					</div>
					{!isSidebarCollapsed && (
						<ChevronsUpDown size={18} className='opacity-50' />
					)}
				</div>
			</DropdownMenuTrigger>

			<DropdownMenuContent side='right' align='end' className='w-[220px]'>
				<DropdownMenuLabel className='flex gap-3 items-center'>
					<Avatar className='h-8 w-8'>
						<AvatarImage src={userData?.avatarUrl} />
						<AvatarFallback>{getInitials(userData?.name)}</AvatarFallback>
					</Avatar>
					<div className='flex flex-col'>
						<span className='font-semibold'>{userData?.username}</span>
						<span className='text-xs text-muted-foreground'>
							{truncateName(userData?.email || '', 23)}
						</span>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuItem className='cursor-pointer'>
					<LuCrown />
					Upgrade to premium
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem>
					<Link
						href={PAGES.ACCOUNT}
						className='flex items-center gap-2 w-full cursor-pointer'
					>
						<FaRegCircleUser />
						<span>Account</span>
					</Link>
				</DropdownMenuItem>
				<DropdownMenuItem>
					<Link
						href={PAGES.CHANNELS}
						className='flex items-center gap-2 w-full cursor-pointer'
					>
						<MdOutlineVideoLibrary />
						<span>Channels</span>
					</Link>
				</DropdownMenuItem>
				<DropdownMenuItem className='cursor-pointer'>
					<FiBell />
					Notifications
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem className='cursor-pointer' onClick={() => logout()}>
					<MdLogout />
					Log out
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}
