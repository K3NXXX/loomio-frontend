import type { ReactNode } from 'react'

import { AuthThemeConfiguratorFab } from '@/components/auth/AuthThemeConfiguratorFab'

export default function AuthRouteGroupLayout({
	children,
}: {
	children: ReactNode
}) {
	return (
		<>
			{children}
			<AuthThemeConfiguratorFab />
		</>
	)
}
