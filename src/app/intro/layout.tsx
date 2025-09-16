import { cookies } from 'next/headers'

import { IntroHeader } from '@/components/intro/IntroHeader'
import { loggedInItems, loggedOutItems } from '@/lists/home.header.items.list'

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const cookieStore = await cookies()
	const token = cookieStore.get('accessToken')?.value
	const items = token ? loggedInItems : loggedOutItems

	return (
		<div
			style={{
				background: 'linear-gradient(250deg, #202020 0%, transparent 50%)',
			}}
			className='w-full'
		>
			<div className='relative min-h-screen mx-auto max-w-[1200px] px-5'>
				<IntroHeader items={items} />
				<div>{children}</div>
			</div>
		</div>
	)
}
