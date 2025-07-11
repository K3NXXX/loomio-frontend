import { SignUpForm } from '@/components/intro/auth/SignUpForm'
import { IntroHeader } from '@/components/intro/IntroHeader'
import Image from 'next/image'
import ImageLayout from "/public/images/auth-layout.png"

export function SignUp() {
	return (
		<div className='relative'>
			<IntroHeader />
			{/* <div className='absolute top-0 left-0  w-170 h-screen'>
				<Image
					src={ImageLayout}
					alt='auth background'
					fill
					style={{ objectFit: 'cover' }}
				/>
			</div> */}
			<div className='flex'>
				<div className='w-[60%]'></div>
			<SignUpForm />
			</div>
		</div>
	)
}
