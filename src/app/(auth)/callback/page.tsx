'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AuthCallbackPage() {
	const router = useRouter();

	useEffect(() => {
		// optionally перевірка токена на бекенді
		// або просто редірект
		router.replace('/dashboard');
	}, [router]);

	return (
		<div className='flex h-screen items-center justify-center'>
			<p className='text-lg text-neutral-200'>Авторизація успішна. Завантаження...</p>
		</div>
	);
}
