'use client'

import { PAGES } from '@/constants/pages.constants'
import { useGlobalStore } from '@/zustand/store/globalStore'
import Link from 'next/link'
import { useState } from 'react'
import { IoClose, IoMenu, IoSearch } from 'react-icons/io5'

import { Breadcrumb } from '@/components/ui/breadcrumb'
import { useGetMe } from '@/hooks/auth/useGetMe'
import { cn } from '@/lib/utils'
import { Input } from '../../ui/input'
import { Logo } from '../../ui/Logo'
import { Separator } from '../../ui/separator'

export function HomeHeader() {
	const { toggleSidebarCollapsed } = useGlobalStore()
	const [search, setSearch] = useState('')
	const { userData } = useGetMe()

	return (
		<header
			className={cn(
				'sticky top-0 left-0 right-0 z-50',
				'bg-[oklch(0.19_0_0/0.7)] backdrop-blur-lg',
				'shadow-[0_4px_15px_rgba(0,0,0,0.3)]',
			)}
		>
			<div className='flex flex-col pb-5'>
				<div className='pt-5 pl-6 flex justify-between items-center max-w-[99%] w-full px-3'>
					<Breadcrumb className='flex h-5 items-center space-x-4 text-sm'>
						<IoMenu
							onClick={() => toggleSidebarCollapsed()}
							size={30}
							className='cursor-pointer'
						/>
						<Separator orientation='vertical' />
						<Logo />
					</Breadcrumb>

					<div className='flex-1 max-w-md mx-4 relative'>
						<IoSearch className='absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground size-5' />
						<Input
							type='text'
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							placeholder='Search...'
							className='w-full pl-12 pr-12 py-3 text-base rounded-xl bg-muted 
						focus:ring-2 focus:ring-primary 
						transition-all duration-300 ease-in-out'
						/>
						{search && (
							<IoClose
								className='absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground size-5 cursor-pointer hover:text-foreground transition-colors'
								onClick={() => setSearch('')}
							/>
						)}
					</div>

					<div className='px-3'>
						<Link href={PAGES.ACCOUNT}>
							<p className='font-bold'>Welcome, {userData?.name}!</p>
						</Link>
					</div>
				</div>
			</div>
		</header>
	)
}
