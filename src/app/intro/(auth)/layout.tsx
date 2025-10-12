import type { ReactNode } from 'react'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { PAGES } from '@/constants/pages.constants'

import { ClientAuthLayout } from './ClientAuthLayout'

export default async function AuthLayout({
	children,
}: {
	children: ReactNode
}) {
	const cookieStore = await cookies()
	const token = cookieStore.get('accessToken')?.value

	if (token) redirect(PAGES.HOME)

	return <ClientAuthLayout>{children}</ClientAuthLayout>
}
