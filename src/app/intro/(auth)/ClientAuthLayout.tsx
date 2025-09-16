'use client'
import type { ReactNode } from 'react'
import { useEffect, useRef, useState } from 'react'

import Lottie from 'lottie-react'

import animationData from '@/assets/animations/planet.json'

import type { LottieRefCurrentProps } from 'lottie-react'

export function ClientAuthLayout({ children }: { children: ReactNode }) {
	const [isReady, setIsReady] = useState(false)
	const lottieRef = useRef<LottieRefCurrentProps>(null)

	useEffect(() => {
		const lottie = lottieRef.current
		if (!lottie) {
			return
		}

		const waitUntilLoaded = setInterval(() => {
			if (lottie.getDuration()! > 0) {
				setIsReady(true)
				clearInterval(waitUntilLoaded)
			}
		}, 50)

		return () => clearInterval(waitUntilLoaded)
	}, [])

	return (
		<div className='relative mx-auto max-w-[1200px] px-5 pb-10'>
			<div className='flex justify-between relative max-[1150px]:justify-center'>
				<div>
					<Lottie
						lottieRef={lottieRef}
						animationData={animationData}
						loop={true}
						className='w-150 h-150 absolute top-40 left-0 max-[1150px]:hidden'
					/>
				</div>
				{isReady && (
					<div className='animate-fade-in opacity-0 animate-delay-200'>
						{children}
					</div>
				)}
			</div>
		</div>
	)
}
