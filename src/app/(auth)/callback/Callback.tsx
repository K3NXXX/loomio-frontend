'use client'
import { useEffect } from 'react'

import Lottie from 'lottie-react'
import { useRouter } from 'next/navigation'

import loader from '@/assets/animations/loader.json'
import { PAGES } from '@/constants/pages.constants'

export function Callback() {
	const router = useRouter()

	useEffect(() => {
		router.replace(PAGES.HOME)
	}, [router])

	return (
		<div className='flex items-center justify-center relative h-screen '>
			<div className='flex items-center flex-col'>
				<Lottie animationData={loader} loop={true} className='w-40' />
				<p className='mt-4 text-[16px] font-bold text-center max-[340px]:w-[200px]'>
					Authorization in progress, please wait...
				</p>
			</div>
		</div>
	)
}
