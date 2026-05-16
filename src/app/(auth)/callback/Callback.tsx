'use client'
import { useEffect } from 'react'

import Lottie from 'lottie-react'
import { useRouter } from 'next/navigation'

import loader from '@/assets/animations/loader.json'
import { PAGES } from '@/constants/pages.constants'
import { useTranslations } from 'next-intl'

export function Callback() {
	const router = useRouter()
	const t = useTranslations()

	useEffect(() => {
		router.replace(PAGES.HOME)
	}, [router])

	return (
		<div className='flex items-center justify-center relative min-h-screen bg-background text-foreground px-4'>
			<div className='flex items-center flex-col'>
				<Lottie animationData={loader} loop={true} className='w-40' />
				<p className='mt-4 text-base font-bold text-center max-[340px]:w-[200px] text-foreground'>
					{t('OauthLoading')}
				</p>
			</div>
		</div>
	)
}
