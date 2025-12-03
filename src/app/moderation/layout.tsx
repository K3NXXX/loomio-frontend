'use client'

import loader from '@/assets/animations/loader.json'
import { ModerationHeader } from '@/components/admin/ModerationHeader'
import { ModerationSidebar } from '@/components/admin/ModerationSidebar'
import { useGetMe } from '@/hooks/auth/useGetMe'
import Lottie from 'lottie-react'

export default function ModerationLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const { userData, isLoading } = useGetMe()

	if (isLoading || !userData) {
		return (
			<div className='w-full h-screen flex items-center justify-center text-white'>
				<Lottie animationData={loader} loop className='absolute w-20 h-20' />
			</div>
		)
	}

	return (
		<div className='h-screen flex flex-col bg-[#0e0e0e] text-white'>
			{/* HEADER */}
			<ModerationHeader user={userData} />

			{/* SIDEBAR + CONTENT */}
			<div className='flex flex-1 min-h-0'>
				<ModerationSidebar user={userData} />

				<main className='flex-1 overflow-y-auto p-6'>{children}</main>
			</div>
		</div>
	)
}
