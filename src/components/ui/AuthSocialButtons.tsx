import { Card } from '@/components/ui/card'
import { FaFacebook, FaGoogle } from 'react-icons/fa'
import { IoLogoGithub } from 'react-icons/io5'
export function AuthSocialButtons() {
	return (
		<div className='flex justify-center gap-5'>
			<Card className='bg-neutral-900 py-5 px-5 cursor-pointer flex justify-center items-center w-full'>
				<FaGoogle color='#fb2c36' size={20} />
			</Card>
			<Card className='bg-neutral-900 py-5 px-5 cursor-pointer flex justify-center items-center w-full'>
				{' '}
				<IoLogoGithub color='white' size={22} />
			</Card>
		</div>
	)
}
