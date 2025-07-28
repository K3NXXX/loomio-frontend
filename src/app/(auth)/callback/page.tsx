'use client'

import { useEffect } from 'react'

import { useRouter } from 'next/navigation'

import { PAGES } from '@/constants/pages.constants'

export default function AuthCallbackPage() {
	const router = useRouter()

	useEffect(() => {
		router.replace(PAGES.DASHBOARD)
	}, [router])

	return (
		<div className='flex h-screen items-center justify-center'>
			<p className='text-lg text-neutral-200'>
				Авторизація успішна. Завантаження...
			</p>
		</div>
	)
}
