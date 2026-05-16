import { Montserrat } from 'next/font/google'
import { cookies } from 'next/headers'
import { Toaster } from 'sonner'

import ClientProviders from '@/components/providers/ClientProviders'
import { SITE_NAME } from '@/constants/seo.constants'
import { CUSTOM_THEME_COOKIE_NAME, buildCustomThemeCssVariablesRecord } from '@/lib/custom-theme-vars'
import { NextIntlClientProvider } from 'next-intl'
import type { Metadata, Viewport } from 'next'
import type { CSSProperties } from 'react'
import './globals.css'

const montserratSans = Montserrat({
	variable: '--font-montserrat-sans',
	subsets: ['latin'],
})

export const viewport: Viewport = {
	themeColor: '#0a0a0a',
	width: 'device-width',
	initialScale: 1,
	maximumScale: 5,
}

export const metadata: Metadata = {
	title: SITE_NAME,
	description: `${SITE_NAME} — videos and channels`,
	applicationName: SITE_NAME,
	icons: {
		icon: '/favicon.svg',
		apple: '/favicon.svg',
	},
	appleWebApp: {
		capable: true,
		title: SITE_NAME,
		statusBarStyle: 'black-translucent',
	},
	formatDetection: {
		telephone: false,
	},
}

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	const cookiesList = await cookies()
	const rawAppearance = cookiesList.get('appearance')?.value?.toLowerCase() ?? 'dark'
	const isDarkMode = rawAppearance !== 'light'
	const theme = cookiesList.get('theme')?.value || 'BLUE'
	let customThemeStyle: CSSProperties | undefined
	if (theme === 'CUSTOM') {
		const raw = cookiesList.get(CUSTOM_THEME_COOKIE_NAME)?.value
		if (raw) {
			try {
				const parsed = JSON.parse(raw) as {
					background?: string
					primary?: string
				}
				if (parsed.background && parsed.primary) {
					customThemeStyle = buildCustomThemeCssVariablesRecord(
						parsed.background,
						parsed.primary,
					) as CSSProperties
				}
			} catch {
				customThemeStyle = undefined
			}
		}
	}
	const locale = (cookiesList.get('locale')?.value || 'uk') as 'uk' | 'en'

	const messages = (await import(`@/locales/${locale}.json`)).default
	return (
		<html
			lang={locale === 'uk' ? 'uk' : 'en'}
			className={`theme-${theme.toLowerCase()} ${isDarkMode ? 'dark' : ''}`}
			style={customThemeStyle}
		>
			<body className={`${montserratSans.variable}  antialiased`}>
				<NextIntlClientProvider locale={locale} messages={messages}>
					<ClientProviders>{children}</ClientProviders>
				</NextIntlClientProvider>
				<Toaster
					className='w-full max-w-[320px] max-[350px]:max-w-[280px] !z-60 !important '
					position='top-right'
					toastOptions={{
						duration: 3000,
						style: {
							maxWidth: '320px',
							width: '100%',
							pointerEvents: 'auto',
						},
					}}
				/>
			</body>
		</html>
	)
}
