'use client'

import { useGlobalStore } from '@/zustand/store/globalStore'
import Link from 'next/link'
import { useState } from 'react'
import { IoClose, IoMenu, IoSearch } from 'react-icons/io5'
import { Breadcrumb } from '../ui/breadcrumb'
import { Input } from '../ui/input'
import { Logo } from '../ui/Logo'
import { Separator } from '../ui/separator'
import { PAGES } from '@/constants/pages.constants'

export function HomeHeader() {
	const { isHeaderSticky, toggleSidebarCollapsed } = useGlobalStore()
	const [search, setSearch] = useState('')

	return (
		<div
			className={`pt-5 flex justify-between items-center max-w-[99%] w-full ${
				isHeaderSticky
					? 'sticky top-0 z-50 bg-background/80 backdrop-blur-md'
					: ''
			}`}
		>
			{/* Ліва частина */}
			<Breadcrumb className='flex h-5 items-center space-x-4 text-sm px-3'>
				<IoMenu
					onClick={() => toggleSidebarCollapsed()}
					size={30}
					className='cursor-pointer'
				/>
				<Separator orientation='vertical' />
				<Logo />
			</Breadcrumb>

			{/* Центр — пошук */}
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
					<p className='font-bold'>Welcome, Volodymyr!</p>
				</Link>
			</div>
		</div>
	)
}
