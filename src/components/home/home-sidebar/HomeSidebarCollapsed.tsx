'use client'

import { useGetMe } from '@/hooks/auth/useGetMe'
import { isSidebarItemActive } from '@/lib/sidebar-active'
import { getSidebarMenuItems } from '@/lists/sidebar.menu.items'
import clsx from 'clsx'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { HomeUserMenu } from './HomeUserMenu'
import { useTranslations } from 'next-intl'

export function HomeSidebarCollapsed() {
	const pathname = usePathname()
	const { isAuthenticated } = useGetMe()
	const menuItems = getSidebarMenuItems(isAuthenticated)
	const t = useTranslations()

	return (
		<aside className='sticky top-[76px] h-[calc(100vh-76px)] flex flex-col items-center w-[80px] border-r border-border bg-sidebar/90 backdrop-blur-xl shadow-sm py-4 dark:border-transparent dark:bg-background/80'>
			<ul className='flex flex-col items-center gap-3 w-full'>
				{menuItems.map((item) => {
					const isActive = isSidebarItemActive(pathname, item.url)

					return (
						<li
							key={item.id}
							className='w-full flex justify-center cursor-pointer'
						>
							<Link
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
										'text-foreground group-hover:text-primary',
									)}
								>
									<span>{t(item.label)}</span>
								</span>
							</Link>
						</li>
					)
				})}
			</ul>

			{isAuthenticated ? (
				<div className='mt-auto pt-3 pb-5 w-full flex justify-center'>
					<HomeUserMenu />
				</div>
			) : null}
		</aside>
	)
}
