'use client'
import { ChevronsUpDown } from 'lucide-react'
import { FaRegCircleUser } from 'react-icons/fa6'
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
import { useState } from 'react'
import { UserChannelsModal } from '@/components/account/channels/channel/UserChannelsModal'
import { useTranslations } from 'next-intl'

export function HomeUserMenu() {
	const { userData } = useGetMe()
	const { logout } = useLogout()
	const { isSidebarCollapsed } = useGlobalStore()
	const [isChannelsOpen, setIsChannelsOpen] = useState(false)
	const t = useTranslations()

	return (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<div
						className={`${isSidebarCollapsed ? 'hover:bg-muted transition-colors duration-300 ease-in-out rounded-md cursor-pointer' : 'flex items-center justify-between w-full hover:bg-muted transition-colors rounded-md gap-1 cursor-pointer p-2 ml-2'}`}
					>
						<div className='flex items-center gap-3'>
							<Avatar className='h-9 w-9'>
								<AvatarImage src={userData?.avatarUrl} />
								<AvatarFallback>{getInitials(userData?.username)}</AvatarFallback>
							</Avatar>
							{!isSidebarCollapsed && (
								<div className='flex flex-col overflow-hidden'>
									<p className='font-semibold text-sm truncate'>
										@{truncateName(userData?.username || '', 17)}
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
							<AvatarFallback>{getInitials(userData?.username)}</AvatarFallback>
						</Avatar>
						<div className='flex flex-col'>
							<span className='font-semibold'>
								@{truncateName(userData?.username || '', 17)}
							</span>
							<span className='text-xs text-muted-foreground'>
								{truncateName(userData?.email || '', 23)}
							</span>
						</div>
					</DropdownMenuLabel>
					<DropdownMenuSeparator />
					<DropdownMenuItem className='cursor-pointer'>
						<LuCrown />
						{t('userMenu.upgrade')}
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem>
						<Link
							href={PAGES.ACCOUNT}
							className='flex items-center gap-2 w-full cursor-pointer'
						>
							<FaRegCircleUser />
							<span>{t('userMenu.account')}</span>
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem
						className='flex items-center gap-2 cursor-pointer'
						onSelect={() => {
							setTimeout(() => {
								setIsChannelsOpen(true)
							}, 0)
						}}
					>
						<MdOutlineVideoLibrary />
						<span>{t('userMenu.channels')}</span>
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem className='cursor-pointer' onClick={() => logout()}>
						<MdLogout />
						{t('userMenu.logout')}
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
			<UserChannelsModal
				open={isChannelsOpen}
				onOpenChange={setIsChannelsOpen}
			/>
		</>
	)
}
