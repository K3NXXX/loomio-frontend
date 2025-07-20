'use client'
import { DashboardHeader } from '@/components/dashboard/DashboardHeader'
import { DashboardSidebarMenu } from '@/components/dashboard/DashboardSidebarMenu'
import { Button } from '@/components/ui/button'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { ReactNode } from 'react'
import { IoMdSettings } from 'react-icons/io'

export default function DashboardLayout({ children }: { children: ReactNode }) {
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
				<div className='w-[100%]'>
					<DashboardHeader />
					{children}
				</div>
			</div>
			<Button className='w-[45px] h-[45px] p-0 fixed right-6 bottom-6 rounded-lg'>
				<IoMdSettings size={100} className='size-[25px] text-white' />
			</Button>
		</div>
	)
}
