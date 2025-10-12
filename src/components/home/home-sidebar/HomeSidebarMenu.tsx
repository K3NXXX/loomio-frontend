'use client'

import { sidebarMenu } from '@/lists/sidebar.menu.items'
import clsx from 'clsx'
import { usePathname } from 'next/navigation'
import { HomeUserMenu } from './HomeUserMenu'

export function HomeSidebarMenu() {
	const pathname = usePathname()

	return (
		<>
			<aside
				className='hidden lg:flex flex-col min-w-[240px] max-w-[240px]
				sticky top-[76px] h-[calc(100vh-76px)] bg-[oklch(0.19_0_0/0.7)] backdrop-blur-lg'
			>
				<div className='flex-1 pr-5 py-6 overflow-y-auto custom-scrollbar'>
					<ul className='space-y-1 px-2'>
						{sidebarMenu.map((item) => {
							const isActive = pathname === item.url

							return (
								<li className='cursor-pointer' key={item.id}>
									<a
										href={item.url}
										className={clsx(
											'group relative flex items-center gap-3 px-6 py-[10px] rounded-xl transition-all duration-200 ease-in-out text-[16px] font-medium',
											{
												'bg-primary/10 text-primary shadow-inner': isActive,
												'hover:bg-muted/60 hover:text-primary': !isActive,
											},
										)}
									>
										{isActive && (
											<span className='absolute left-0 top-0 h-full w-[3px] bg-primary rounded-r-full' />
										)}

										<item.icon
											size={20}
											className={clsx('transition-colors duration-200', {
												'text-primary': isActive,
												'text-muted-foreground group-hover:text-primary':
													!isActive,
											})}
										/>
										<span>{item.label}</span>
									</a>
								</li>
							)
						})}
					</ul>
				</div>

				<div className='pr-4 py-5 bg-background/70 backdrop-blur-md'>
					<HomeUserMenu />
				</div>
			</aside>

			<aside className='flex lg:hidden flex-col items-center min-w-[90px] max-w-[90px] bg-background  shadow-md py-4'>
				<ul className='flex flex-col items-center gap-3 w-full'>
					{sidebarMenu.map((item) => {
						const isActive = pathname === item.url

						return (
							<li key={item.id} className='w-full'>
								<a
									href={item.url}
									className={clsx(
										'flex flex-col items-center justify-center py-3 px-2 rounded-xl transition-all duration-200 text-[12px] text-center w-full',
										{
											'bg-primary/10 text-primary shadow-inner': isActive,
											'hover:bg-muted/60 hover:text-primary': !isActive,
										},
									)}
								>
									<item.icon
										className={clsx(
											'transition-[font-size,color] duration-200',
											isActive ? 'text-[28px]' : 'text-[24px]',
											{
												'text-primary': isActive,
												'text-muted-foreground group-hover:text-primary':
													!isActive,
											},
										)}
									/>
									<span className='mt-1'>{item.label}</span>
								</a>
							</li>
						)
					})}
				</ul>

				<div className='mt-auto pt-3  w-full flex justify-center'>
					<HomeUserMenu />
				</div>
			</aside>
		</>
	)
}
