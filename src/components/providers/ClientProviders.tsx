'use client'
import { MiniPlayerRouteSync } from '@/components/account/videos/watch/MiniPlayerRouteSync'
import { PremiumMiniPlayer } from '@/components/account/videos/watch/PremiumMiniPlayer'
import { CustomThemeSync } from '@/components/providers/CustomThemeSync'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Suspense, useState } from 'react'

const ClientProviders = ({ children }: { children: React.ReactNode }) => {
	const [queryClient] = useState(() => new QueryClient())
	return (
		<QueryClientProvider client={queryClient}>
			<CustomThemeSync />
			<Suspense fallback={null}>
				<MiniPlayerRouteSync />
			</Suspense>
			<PremiumMiniPlayer />
			{children}
		</QueryClientProvider>
	)
}

export default ClientProviders
