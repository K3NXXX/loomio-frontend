import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

import { PAGES } from '@/constants/pages.constants'

import { ClientDashboardLayout } from './ClientDashboardLayout'

export default async function DashboardLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const cookieStore = await cookies()
	const token = cookieStore.get('accessToken')?.value

	if (!token) {
		redirect(PAGES.LOGIN)
	}

	return <ClientDashboardLayout>{children}</ClientDashboardLayout>
}
