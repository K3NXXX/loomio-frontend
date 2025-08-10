'use client'
import { sidebarMenu } from '@/lists/sidebar.menu.items'

import { Logo } from '../../ui/Logo'
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
} from '../../ui/sidebar'

import { DashboardUserMenu } from './DashboardUserMenu'

export function DashboardSidebarMenu() {
	return (
		<Sidebar className='bg-background border-r shadow-sm min-w-[250px]'>
			<SidebarHeader className='px-9 py-3 border-b'>
				<Logo />
			</SidebarHeader>

			<SidebarContent className='px-3 py-4'>
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							{sidebarMenu.map((item) => (
								<SidebarMenuItem key={item.id}>
									<SidebarMenuButton asChild>
										<a
											href={item.url}
											className='
										flex items-center gap-3 px-4 py-2 rounded-lg
										hover:bg-muted hover:text-primary transition-colors
										text-[16px] font-medium
									'
										>
											<item.icon size={20} />
											<span>{item.label}</span>
										</a>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>

			<SidebarFooter className='px-4 pb-5'>
				<DashboardUserMenu />
			</SidebarFooter>
		</Sidebar>
	)
}
