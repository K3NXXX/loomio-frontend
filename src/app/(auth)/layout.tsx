'use client'
import { IntroHeader } from '@/components/intro/IntroHeader'
import Lottie, { LottieRefCurrentProps } from 'lottie-react'
import { ReactNode, useEffect, useRef, useState } from 'react'
import animationData from '../../assets/animations/planet.json'

export default function AuthLayout({ children }: { children: ReactNode }) {
	const lottieRef = useRef<LottieRefCurrentProps>(null)
	const [isReady, setIsReady] = useState(false)

	useEffect(() => {
		const lottie = lottieRef.current
		if (!lottie) return

		const waitUntilLoaded = setInterval(() => {
			if (lottie.getDuration()! > 0) {
				setIsReady(true)
				clearInterval(waitUntilLoaded)
			}
		}, 50)

		return () => clearInterval(waitUntilLoaded)
	}, [])
	return (
		<div
			style={{
				background: 'linear-gradient(250deg, #202020 0%, transparent 50%)',
			}}
			className='w-full'
		>
			<div className='relative min-h-screen mx-auto max-w-[1200px] px-5 pb-10'>
				<IntroHeader />
				<div className='flex justify-between relative max-[1120px]:justify-center'>
					<div>
						<Lottie
							lottieRef={lottieRef}
							animationData={animationData}
							loop={true}
							className='w-150 h-150 absolute top-40 left-0 max-[1120px]:hidden'
						/>
					</div>
					{isReady && (
						<div className='animate-fade-in opacity-0 animate-delay-200'>
							{children}
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
