import { SidebarProvider } from '@/components/ui/sidebar'
import { PAGES } from '@/constants/pages.constants'
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

	if (!token) {
		redirect(PAGES.LOGIN)
	}

	return (
		<SidebarProvider>
			<ClientHomeLayout>{children}</ClientHomeLayout>
		</SidebarProvider>
	)
}
