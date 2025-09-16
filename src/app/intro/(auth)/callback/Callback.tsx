'use client'
import { useEffect } from 'react'

import Lottie from 'lottie-react'
import { useRouter } from 'next/navigation'

import loader from '@/assets/animations/loader.json'
import { PAGES } from '@/constants/pages.constants'

export function Callback() {
	const router = useRouter()

	useEffect(() => {
		router.replace(PAGES.DASHBOARD)
	}, [router])

	return (
		<div className='flex items-center justify-center relative h-[200px] max-[1120px]:min-h-[200px]'>
			<div className='relative top-70 right-30 max-[1120px]:right-0 max-[1120px]:top-60 max-[340px]:top-40'>
				<Lottie
					animationData={loader}
					loop={true}
					className='w-40 h-40 relative -right-17 top-10 max-[340px]:-right-5 max-[340px]:top-15'
				/>
				<p className='mt-4 text-[16px] font-bold text-center max-[340px]:w-[200px]'>
					Authorization in progress, please wait...
				</p>
			</div>
		</div>
	)
}
