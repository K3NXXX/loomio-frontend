import { SidebarProvider } from '@/components/ui/sidebar'
import { PAGES } from '@/constants/pages.constants'
import { jwtDecode } from 'jwt-decode'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { ClientHomeLayout } from './ClientHomeLayout'

export default async function HomeLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const cookieStore = await cookies()
	const token = cookieStore.get('accessToken')?.value

	if (!token) redirect(PAGES.LOGIN)

	let payload
	try {
		payload = jwtDecode(token)
	} catch {
		redirect(PAGES.LOGIN)
	}

	if (payload.role === 'ADMIN') {
		redirect(PAGES.MODERATION_DASHBOARD)
	}
	return (
		<SidebarProvider>
			<ClientHomeLayout>{children}</ClientHomeLayout>
		</SidebarProvider>
	)
}
