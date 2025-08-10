'use client'
import type { ReactNode } from 'react'

import { IoMdSettings } from 'react-icons/io'

import { DashboardSidebarMenu } from '@/components/dashboard/dashboard-sidebar/DashboardSidebarMenu'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { DashboardUIConfiguratorMenu } from '@/components/dashboard/DashboardUIConfiguratorMenu'
import { Button } from '@/components/ui/button'
import { SidebarProvider } from '@/components/ui/sidebar'
import { useGlobalStore } from '@/zustand/store/globalStore'

export function ClientDashboardLayout({ children }: { children: ReactNode }) {
	const { toggleThemeMenuOpened } = useGlobalStore()

	return (
		<div
			style={{
				background: 'linear-gradient(250deg, #202020 0%, transparent 50%)',
			}}
			className='w-full min-h-screen'
		>
			<div>
				<div>
					<SidebarProvider className='flex gap-3  px-3'>
						<DashboardSidebarMenu />
						<div className='w-full'>
							<DashboardHeader />
							<div className='pt-15  px-1'>{children}</div>
						</div>
					</SidebarProvider>
				</div>
			</div>
			<Button
				onClick={() => toggleThemeMenuOpened()}
				className='w-[45px] h-[45px] p-0 fixed right-6 bottom-6 rounded-lg'
			>
				<IoMdSettings size={100} className='size-[25px]' />
			</Button>
			<DashboardUIConfiguratorMenu />
		</div>
	)
}
