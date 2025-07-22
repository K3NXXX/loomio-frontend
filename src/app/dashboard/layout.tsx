'use client'
import { DashboardSidebarMenu } from '@/components/dashboard/DashboardSidebarMenu'
import { DashboardThemesMenu } from '@/components/dashboard/DashboardThemesMenu'
import { Button } from '@/components/ui/button'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { useGlobalStore } from '@/zustand/store/globalStore'
import { ReactNode } from 'react'
import { IoMdSettings } from 'react-icons/io'

export default function DashboardLayout({ children }: { children: ReactNode }) {
	const { toggleThemeMenuOpened } = useGlobalStore()
	return (
		<div
			style={{
				background: 'linear-gradient(250deg, #202020 0%, transparent 50%)',
			}}
			className='w-full min-h-screen'
		>
			<div className='flex gap-3 '>
				<div>
					<SidebarProvider>
						<DashboardSidebarMenu />
						<SidebarTrigger />
					</SidebarProvider>
				</div>
				<div className='w-full'>
					{/* <DashboardHeader /> */}
					<div className='pt-15 px-3'>{children}</div>
				</div>
			</div>
			<Button
				onClick={() => toggleThemeMenuOpened()}
				className='w-[45px] h-[45px] p-0 fixed right-6 bottom-6 rounded-lg'
			>
				<IoMdSettings size={100} className='size-[25px] text-white' />
			</Button>
			<DashboardThemesMenu />
		</div>
	)
}
