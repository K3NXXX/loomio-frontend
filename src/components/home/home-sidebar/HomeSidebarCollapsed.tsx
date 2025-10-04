'use client'

import { sidebarMenu } from '@/lists/sidebar.menu.items'
import clsx from 'clsx'
import { usePathname } from 'next/navigation'
import { HomeUserMenu } from './HomeUserMenu'

export function HomeSidebarCollapsed() {
	const pathname = usePathname()

	return (
		<aside className='flex flex-col items-center w-[80px] bg-background/80 backdrop-blur-xl border-r border-border shadow-md py-4'>
			<ul className='flex flex-col items-center gap-3 w-full'>
				{sidebarMenu.map((item) => {
					const isActive = pathname === item.url

					return (
						<li
							key={item.id}
							className='w-full flex justify-center cursor-pointer'
						>
							<a
								href={item.url}
								className={clsx(
									'group flex flex-col items-center justify-center w-14 h-16 rounded-xl transition-all duration-200 text-center',
									{
										'bg-primary/10 shadow-inner': isActive,
										'hover:bg-muted/60': !isActive,
									},
								)}
							>
								<item.icon
									className={clsx(
										'transition-colors duration-200 mb-1',
										isActive
											? 'text-primary'
											: 'text-muted-foreground group-hover:text-primary',
										isActive ? 'text-[28px]' : 'text-[24px]',
									)}
								/>

								<span
									className={clsx(
										'leading-3 text-[11px] font-medium transition-colors duration-200',
										'text-white group-hover:text-primary',
									)}
								>
									{item.label}
								</span>
							</a>
						</li>
					)
				})}
			</ul>

			<div className='mt-auto pt-3 border-t w-full flex justify-center'>
				<HomeUserMenu />
			</div>
		</aside>
	)
}
