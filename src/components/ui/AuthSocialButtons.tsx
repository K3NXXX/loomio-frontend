import { Card } from '@/components/ui/card';
import { FaGoogle } from 'react-icons/fa';
import { IoLogoGithub } from 'react-icons/io5';

export function AuthSocialButtons() {
	const handleOAuthLogin = (provider: 'google' | "github") => {
		const authUrl =
			provider === 'google'
				? process.env.NEXT_PUBLIC_GOOGLE_AUTH!
				: process.env.NEXT_PUBLIC_GITHUB_AUTH!;

		window.location.href = authUrl;
	};

	return (
		<div className='flex justify-center gap-5'>
			<Card
				onClick={() => handleOAuthLogin('google')}
				className='bg-neutral-900 py-5 px-5 cursor-pointer flex justify-center items-center w-full'
			>
				<FaGoogle
					color='#fb2c36'
					size={20}
				/>
			</Card>
			<Card
				onClick={() => handleOAuthLogin('github')}
				className='bg-neutral-900 py-5 px-5 cursor-pointer flex justify-center items-center w-full'
			>
				<IoLogoGithub
					color='white'
					size={22}
				/>
			</Card>
		</div>
	);
}
