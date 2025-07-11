import { homeHeaderItems } from '@/lists/home.header.items.list'
import Link from 'next/link'
import { Card } from '../ui/card'
import { Logo } from '../ui/Logo'

export function IntroHeader() {
	return (
		<Card className='bg-neutral-900 absolute right-0 left-0 top-10 mx-auto max-w-[1200px] relative z-50 py-1  rounded-[12px]  px-6 py-4'>
			<header className='flex justify-between'>
				<Logo />

				<ul className='flex items-center gap-6'>
					{homeHeaderItems.map(item => (
						<li key={item.id}>
							<Link
								href={item.href}
								className='flex gap-2 items-center text-[16px] font-medium text-white'
							>
								<item.icon />
								<p>{item.label}</p>
							</Link>
						</li>
					))}
				</ul>
			</header>
		</Card>
	)
}
