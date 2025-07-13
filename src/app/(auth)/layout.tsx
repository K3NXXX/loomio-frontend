'use client'
import { IntroHeader } from '@/components/intro/IntroHeader'
import Lottie from 'lottie-react'
import { ReactNode } from 'react'
import animationData from '../../assets/animations/planet2.json'

export default function AuthLayout({ children }: { children: ReactNode }) {
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
							animationData={animationData}
							loop={true}
							className='w-150 h-150 absolute top-40 left-0 max-[1120px]:hidden'
						/>
					</div>
					<div>{children}</div>
				</div>
			</div>
		</div>
	)
}
