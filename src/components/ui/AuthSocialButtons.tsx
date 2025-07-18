import { Card } from '@/components/ui/card'
import { FaGoogle } from 'react-icons/fa'
import { IoLogoGithub } from 'react-icons/io5'
export function AuthSocialButtons() {
	return (
		<div className='flex justify-center gap-5'>
			<a
				href={process.env.NEXT_PUBLIC_GOOGLE_AUTH!}
				target='_blank'
				rel='noopener noreferrer'
				className='w-full'
			>
				<Card className='bg-neutral-900 py-5 px-5 cursor-pointer flex justify-center items-center w-full'>
					<FaGoogle color='#fb2c36' size={20} />
				</Card>
			</a>
			<a
				href={process.env.NEXT_PUBLIC_GOOGLE_GITHUB!}
				target='_blank'
				rel='noopener noreferrer'
				className='w-full'
			>
				<Card className='bg-neutral-900 py-5 px-5 cursor-pointer flex justify-center items-center w-full'>
					<IoLogoGithub color='white' size={22} />
				</Card>
			</a>
		</div>
	)
}
