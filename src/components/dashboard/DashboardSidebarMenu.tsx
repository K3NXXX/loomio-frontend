import { sidebarMenu } from '@/lists/sidebar.menu.items'
import { Logo } from '../ui/Logo'
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from '../ui/sidebar'

export function DashboardSidebarMenu() {
	return (
		<Sidebar side='left'>
			<SidebarHeader className='px-6'>
				<Logo />
			</SidebarHeader>

			<SidebarContent className='px-3'>
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							{sidebarMenu.map(item => (
								<SidebarMenuItem key={item.id}>
									<SidebarMenuButton asChild>
										<a href={item.url}>
											<item.icon size={50} />
											<span className='text-[16px]'>{item.label}</span>
										</a>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
		</Sidebar>
	)
}
