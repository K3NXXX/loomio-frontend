'use client'
import { SignUpForm } from '@/components/intro/auth/SignUpForm'
import { IntroHeader } from '@/components/intro/IntroHeader'
import Lottie from 'lottie-react'
import animationData from '../../../assets/animations/planet2.json'

export function SignUp() {
	return (
		<div className='relative min-h-screen mx-auto max-w-[1200px] px-5 pb-10'>
			<IntroHeader />
			<div className='flex justify-between relative'>
				<div>
					<Lottie
						animationData={animationData}
						loop={true}
						className='w-150 h-150 absolute top-40 left-0'
					/>
				</div>
				<SignUpForm />
			</div>
		</div>
	)
}
