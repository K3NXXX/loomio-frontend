'use client'
import type { ReactNode } from 'react'

import { HomeSidebarCollapsed } from '@/components/home/home-sidebar/HomeSidebarCollapsed'
import { HomeSidebarMenu } from '@/components/home/home-sidebar/HomeSidebarMenu'
import { HomeHeader } from '@/components/home/HomeHeader'
import { HomeUIConfiguratorMenu } from '@/components/home/HomeUIConfiguratorMenu'
import { Button } from '@/components/ui/button'
import { useGlobalStore } from '@/zustand/store/globalStore'
import { IoMdSettings } from 'react-icons/io'

export function ClientHomeLayout({ children }: { children: ReactNode }) {
	const { toggleThemeMenuOpened, isSidebarCollapsed } = useGlobalStore()

	return (
		<div
			style={{
				background: 'linear-gradient(250deg, #202020 0%, transparent 50%)',
			}}
			className='w-full h-screen flex flex-col'
		>
			<div className='flex flex-1 h-full min-h-screen'>
				{isSidebarCollapsed ? <HomeSidebarCollapsed /> : <HomeSidebarMenu />}

				<div className='flex flex-col flex-1 h-full'>
					<HomeHeader />
					<div className='flex-1 overflow-y-auto px-1 pt-15'>{children}</div>
				</div>
			</div>

			<Button
				onClick={toggleThemeMenuOpened}
				className='w-[45px] h-[45px] p-0 fixed right-6 bottom-6 rounded-lg'
			>
				<IoMdSettings size={100} className='size-[25px]' />
			</Button>

			<HomeUIConfiguratorMenu />
		</div>
	)
}
