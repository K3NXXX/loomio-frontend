'use client'
import { useGetMe } from '@/hooks/auth/useGetMe'
import { sidebarMenu } from '@/lists/sidebar.menu.items'
import { getInitials } from '@/utils/get-initials'

import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Logo } from '../ui/Logo'
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from '../ui/sidebar'

export function DashboardSidebarMenu() {
	const { userData } = useGetMe()

	return (
		<Sidebar side='left'>
			<SidebarHeader className='px-6'>
				<Logo />
			</SidebarHeader>

			<SidebarContent className='px-3'>
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							{sidebarMenu.map((item) => (
								<SidebarMenuItem key={item.id}>
									<SidebarMenuButton asChild>
										<a href={item.url}>
											<item.icon size={20} />
											<span className='text-[18px]'>{item.label}</span>
										</a>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter className='px-4 pb-5'>
				<div className='flex items-center gap-3'>
					<Avatar>
						<AvatarImage src={userData?.avatarUrl} />
						<AvatarFallback>{getInitials(userData?.name)}</AvatarFallback>
					</Avatar>
					<div className='flex flex-col'>
						<p className='font-semibold text-sm'>{userData?.username}</p>
						<p className='text-xs text-muted-foreground'>{userData?.email}</p>
					</div>
				</div>
			</SidebarFooter>
		</Sidebar>
	)
}
