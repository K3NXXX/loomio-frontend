'use client'

import {
	useEffect,
	useMemo,
	useState,
	type CSSProperties,
	type ElementType,
	type ReactNode,
} from 'react'

import Cookies from 'js-cookie'
import axios from 'axios'
import {
	ArrowDownFromLine,
	Crown,
	Languages,
	LayoutGrid,
	Moon,
	Palette,
	PanelLeft,
	PanelRight,
	PanelTop,
	SlidersHorizontal,
	Sparkles,
	Sun,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
} from '@/components/ui/sheet'
import { useGetMe } from '@/hooks/auth/useGetMe'
import { useChangeAppearance } from '@/hooks/user/useChangeAppearance'
import { useChangeColorTheme } from '@/hooks/user/useChangeColorTheme'
import { useChangeCustomTheme } from '@/hooks/user/useChangeCustomTheme'
import {
	applyAppearanceToDocument,
	appearanceFromApi,
	type AppearanceCookieValue,
} from '@/lib/appearance-preference'
import { hexToHsl, hslToHex } from '@/lib/color-hex-hsl'
import {
	CUSTOM_THEME_COOKIE_NAME,
	foregroundForBackground,
	foregroundForPrimary,
	type CustomThemePayload,
} from '@/lib/custom-theme-vars'
import { STICKY_HEADER_COOKIE_KEY } from '@/lib/header-sticky-preference'
import {
	DEFAULT_HOME_SIDEBAR_DOCK_SIDE,
	HOME_SIDEBAR_DOCK_COOKIE_KEY,
	parseHomeSidebarDockCookie,
	type HomeSidebarDockSide,
} from '@/lib/home-sidebar-dock-preference'
import {
	DEFAULT_HOME_VIDEO_GRID_COLUMNS,
	HOME_VIDEO_GRID_COLUMNS,
	HOME_VIDEO_GRID_COOKIE_KEY,
	parseHomeVideoGridCookie,
	type HomeVideoGridColumns,
} from '@/lib/home-videos-grid-preference'
import { premiumPreviewStrip } from '@/lib/premium-theme-preview-oklch'
import { isPremiumOnlyTheme } from '@/lib/premium-themes'
import { applyThemeClassOnDocument } from '@/lib/theme-dom'
import { cn } from '@/lib/utils'
import { UIConfiguratorColors } from '@/lists/ui.configurator.colors.list'
import { UIConfiguratorPremiumColors } from '@/lists/ui.configurator.premium-colors.list'
import { useGlobalStore } from '@/zustand/store/globalStore'

import { AppearanceApi, THEME_COLORS } from '@/types/colors.types'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'

const ALL_THEME_SWATCHES = [
	...UIConfiguratorColors,
	...UIConfiguratorPremiumColors,
]

const DEFAULT_CUSTOM_BG = '#121212'
const DEFAULT_CUSTOM_PRIMARY = '#6366f1'

function linearPremiumPreview(colors: readonly string[]): string {
	if (colors.length === 2) {
		return `linear-gradient(126deg, ${colors[0]} 0%, ${colors[1]} 100%)`
	}
	const [a, b, c] = colors
	return `linear-gradient(126deg, ${a} 0%, ${a} 16%, ${b} 44%, ${c} 82%, ${c} 100%)`
}

function readCustomPayloadFromCookie(): CustomThemePayload | null {
	try {
		const raw = Cookies.get(CUSTOM_THEME_COOKIE_NAME)
		if (!raw) return null
		const p = JSON.parse(raw) as CustomThemePayload
		if (p.background && p.primary) return p
	} catch {
		return null
	}
	return null
}

function resolveSwatchCustomPayload(
	userData: { customTheme?: CustomThemePayload | null } | undefined,
): CustomThemePayload {
	if (userData?.customTheme?.background && userData?.customTheme?.primary) {
		return userData.customTheme
	}
	return (
		readCustomPayloadFromCookie() ?? {
			background: DEFAULT_CUSTOM_BG,
			primary: DEFAULT_CUSTOM_PRIMARY,
		}
	)
}

function CustomThemeSwatchCircle({
	payload,
	active,
	disabled,
	onPick,
	title,
	className,
}: {
	payload: CustomThemePayload
	active: boolean
	disabled?: boolean
	onPick: () => void
	title: string
	className?: string
}) {
	const grad = linearPremiumPreview([payload.background, payload.primary])

	return (
		<button
			type='button'
			disabled={disabled}
			onClick={onPick}
			aria-pressed={active && !disabled}
			aria-disabled={disabled}
			title={title}
			aria-label={title}
			className={cn(
				'relative flex size-7 items-center justify-center overflow-visible rounded-full bg-muted/20 transition-transform duration-150 dark:bg-muted/15',
				'border-2 border-dashed border-amber-500/70 ring-1 ring-amber-400/20 dark:border-amber-400/60 dark:ring-amber-300/12',
				'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
				disabled
					? 'cursor-not-allowed opacity-[0.38] saturate-[0.55]'
					: 'cursor-pointer opacity-95 hover:scale-105 hover:opacity-100',
				active && !disabled
					? 'ring-2 ring-amber-500 ring-offset-2 ring-offset-background dark:ring-amber-400'
					: null,
				className,
			)}
		>
			<span
				aria-hidden
				className='pointer-events-none absolute inset-[3px] rounded-full [backface-visibility:hidden] [transform:translateZ(0)]'
				style={{ backgroundImage: grad }}
			/>
			{active && !disabled ? (
				<span
					className='relative z-[1] flex size-3 items-center justify-center rounded-full bg-background/92 text-[8px] font-bold leading-none text-foreground shadow-sm ring-1 ring-black/10 dark:ring-white/15'
					aria-hidden
				>
					✓
				</span>
			) : null}
		</button>
	)
}

function ThemeSwatchButton({
	item,
	active,
	onPick,
	disabled = false,
	title,
}: {
	item: {
		color: THEME_COLORS
		colorCss: string
		previewColors?: readonly string[]
	}
	active: boolean
	onPick: () => void
	disabled?: boolean
	title?: string
}) {
	const resolvedTitle = title ?? item.color
	const preview =
		item.previewColors && item.previewColors.length >= 2
			? item.previewColors
			: null
	return (
		<button
			type='button'
			disabled={disabled}
			onClick={onPick}
			aria-pressed={active && !disabled}
			aria-disabled={disabled}
			title={resolvedTitle}
			className={cn(
				'relative mx-auto flex size-7 items-center justify-center overflow-hidden rounded-full border border-border/65 transition-transform duration-150 dark:border-border/35',
				preview ? 'bg-muted/35 dark:bg-muted/25' : null,
				'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0',
				disabled
					? 'cursor-not-allowed opacity-[0.38] saturate-[0.55]'
					: 'cursor-pointer opacity-85 hover:scale-105 hover:opacity-100',
				active && !disabled ? 'ring-2 ring-foreground/28 ring-offset-0' : null,
			)}
			style={preview ? undefined : { backgroundColor: item.colorCss }}
		>
			{preview ? (
				<span
					aria-hidden
					className='pointer-events-none absolute inset-[-22%] rounded-full [backface-visibility:hidden] [transform:translateZ(0)]'
					style={{
						backgroundImage: linearPremiumPreview(preview),
					}}
				/>
			) : null}
			{active && !disabled ? (
				<span
					className='relative z-[1] flex size-3 items-center justify-center rounded-full bg-background/92 text-[8px] font-bold leading-none text-foreground shadow-sm ring-1 ring-black/10 dark:ring-white/15'
					aria-hidden
				>
					✓
				</span>
			) : null}
		</button>
	)
}

function PanelSection({
	icon: Icon,
	label,
	children,
	className,
	premiumChrome,
}: {
	icon: ElementType
	label: ReactNode
	children: ReactNode
	className?: string
	premiumChrome?: boolean
}) {
	return (
		<section
			className={cn(
				'rounded-xl border border-border/70 bg-muted/20 px-3 py-2.5 dark:bg-muted/12',
				premiumChrome &&
					'border-amber-400/30 bg-gradient-to-br from-amber-500/[0.06] via-muted/20 to-muted/10 shadow-[inset_0_1px_0_0_rgba(250,204,21,0.12)] dark:border-amber-400/15 dark:from-amber-400/[0.08] dark:via-muted/12 dark:to-muted/10 dark:shadow-[inset_0_1px_0_0_rgba(253,224,71,0.06)]',
				className,
			)}
		>
			<div className='mb-2 flex items-center gap-1.5'>
				<span
					className={cn(
						'flex size-6 shrink-0 items-center justify-center rounded-md ring-1',
						premiumChrome
							? 'bg-amber-400/15 text-amber-700 ring-amber-400/35 dark:bg-amber-400/12 dark:text-amber-300 dark:ring-amber-400/25'
							: 'bg-background/90 text-primary ring-border/50 dark:bg-background/50',
					)}
				>
					<Icon className='size-3.5' aria-hidden />
				</span>
				<h3 className='text-xs font-semibold text-foreground'>{label}</h3>
			</div>
			{children}
		</section>
	)
}

function CustomThemeModalRange({
	channel,
	min,
	max,
	step = 1,
	value,
	accentHex,
	onChange,
	formatValue,
}: {
	channel: string
	min: number
	max: number
	step?: number
	value: number
	accentHex: string
	onChange: (next: number) => void
	formatValue: (v: number) => string
}) {
	const pct = `${((value - min) / (max - min)) * 100}%`

	return (
		<div className='group flex items-center gap-3'>
			<span
				className='flex size-[2.125rem] shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-muted/95 to-muted/50 text-[12px] font-bold tracking-wide text-muted-foreground shadow-inner ring-1 ring-border/60 transition-colors group-hover:from-primary/15 group-hover:text-primary dark:from-muted/50 dark:to-muted/25 dark:ring-white/10'
				aria-hidden
			>
				{channel}
			</span>
			<input
				type='range'
				min={min}
				max={max}
				step={step}
				value={value}
				onChange={(e) => onChange(Number(e.target.value))}
				className='loomio-modal-range shrink-0 min-w-0 flex-1'
				style={
					{
						'--loomio-range-thumb': accentHex,
						'--loomio-range-fill-pct': pct,
					} as CSSProperties
				}
			/>
			<span className='w-[2.875rem] shrink-0 tabular-nums text-right text-[11px] font-semibold text-foreground/80'>
				{formatValue(value)}
			</span>
		</div>
	)
}

export function HomeUIConfiguratorMenu() {
	const [activeColor, setActiveColor] = useState<THEME_COLORS>(
		UIConfiguratorColors[3].color,
	)
	const [activeAppearance, setActiveAppearance] =
		useState<AppearanceCookieValue>('dark')
	const {
		isThemesMenuOpened,
		setThemeMenuOpened,
		headerSticky,
		setHeaderSticky,
		homeVideoColumns,
		setHomeVideoColumns,
		homeSidebarDockSide,
		setHomeSidebarDockSide,
	} = useGlobalStore()
	const { changeColorTheme } = useChangeColorTheme()
	const { mutateAsync: persistAppearance } = useChangeAppearance()
	const { userData } = useGetMe()
	const [activeLocale, setActiveLocale] = useState<'uk' | 'en'>('uk')
	const [customThemeEditorOpen, setCustomThemeEditorOpen] = useState(false)
	const [customEditorChannel, setCustomEditorChannel] = useState<
		'background' | 'accent'
	>('background')
	const t = useTranslations()

	const router = useRouter()

	useEffect(() => {
		setHomeSidebarDockSide(
			parseHomeSidebarDockCookie(
				Cookies.get(HOME_SIDEBAR_DOCK_COOKIE_KEY),
			),
		)
		setHomeVideoColumns(
			parseHomeVideoGridCookie(Cookies.get(HOME_VIDEO_GRID_COOKIE_KEY)),
		)
	}, [setHomeSidebarDockSide, setHomeVideoColumns])

	const canUsePremiumPalettes = Boolean(userData?.isPremium)

	const { saveCustomTheme, isSavingCustomTheme } = useChangeCustomTheme()

	const [draftBgHsl, setDraftBgHsl] = useState(() =>
		hexToHsl(DEFAULT_CUSTOM_BG),
	)
	const [draftPrimaryHsl, setDraftPrimaryHsl] = useState(() =>
		hexToHsl(DEFAULT_CUSTOM_PRIMARY),
	)

	const draftBgHex = useMemo(
		() => hslToHex(draftBgHsl.h, draftBgHsl.s, draftBgHsl.l),
		[draftBgHsl],
	)
	const draftPrimaryHex = useMemo(
		() => hslToHex(draftPrimaryHsl.h, draftPrimaryHsl.s, draftPrimaryHsl.l),
		[draftPrimaryHsl],
	)

	const swatchCustomPayload = useMemo(
		() => resolveSwatchCustomPayload(userData),
		[
			userData?.customTheme?.background,
			userData?.customTheme?.primary,
			userData?.customTheme,
		],
	)

	const hydrateDraftFromCurrentTheme = () => {
		const payload: CustomThemePayload =
			userData?.theme === THEME_COLORS.CUSTOM && userData.customTheme
				? userData.customTheme
				: (readCustomPayloadFromCookie() ?? {
						background: DEFAULT_CUSTOM_BG,
						primary: DEFAULT_CUSTOM_PRIMARY,
					})
		setDraftBgHsl(hexToHsl(payload.background))
		setDraftPrimaryHsl(hexToHsl(payload.primary))
	}

	const openCustomThemeEditor = () => {
		hydrateDraftFromCurrentTheme()
		setCustomEditorChannel('background')
		setCustomThemeEditorOpen(true)
	}

	const selectStoredCustomTheme = async () => {
		if (!userData?.isPremium || isSavingCustomTheme) return
		const payload = resolveSwatchCustomPayload(userData)
		try {
			await saveCustomTheme(payload)
			applyThemeClassOnDocument(THEME_COLORS.CUSTOM, payload)
			Cookies.set('theme', THEME_COLORS.CUSTOM, { expires: 30 })
			Cookies.set(CUSTOM_THEME_COOKIE_NAME, JSON.stringify(payload), {
				expires: 30,
			})
			setActiveColor(THEME_COLORS.CUSTOM)
		} catch {
		}
	}

	const commitCustomTheme = async () => {
		if (!userData?.isPremium) return
		const payload: CustomThemePayload = {
			background: draftBgHex,
			primary: draftPrimaryHex,
		}
		try {
			await saveCustomTheme(payload)
			applyThemeClassOnDocument(THEME_COLORS.CUSTOM, payload)
			Cookies.set('theme', THEME_COLORS.CUSTOM, { expires: 30 })
			Cookies.set(CUSTOM_THEME_COOKIE_NAME, JSON.stringify(payload), {
				expires: 30,
			})
			setActiveColor(THEME_COLORS.CUSTOM)
			setCustomThemeEditorOpen(false)
		} catch {
		}
	}

	const handleClickColor = (color: THEME_COLORS) => {
		setActiveColor(color)
		Cookies.remove(CUSTOM_THEME_COOKIE_NAME, { path: '/' })
		applyThemeClassOnDocument(color)
		Cookies.set('theme', color, { expires: 30 })
		if (userData) {
			changeColorTheme(color)
		}
	}

	const handleAppearance = async (mode: AppearanceCookieValue) => {
		setActiveAppearance(mode)
		applyAppearanceToDocument(mode)
		Cookies.set('appearance', mode, { expires: 30 })
		if (userData) {
			try {
				await persistAppearance(
					mode === 'light' ? AppearanceApi.LIGHT : AppearanceApi.DARK,
				)
			} catch (err) {
				if (axios.isAxiosError(err) && err.response?.status === 404) {
					console.warn(
						'PATCH /user/appearance: 404 — перезапустіть Nest API з актуальним кодом і застосованою міграцією Prisma для поля appearance.',
					)
				} else {
					throw err
				}
			}
		}
		router.refresh()
	}

	const handleChangeLanguage = (locale: 'uk' | 'en') => {
		setActiveLocale(locale)
		Cookies.set('locale', locale, { expires: 30 })
		router.refresh()
	}

	const handleStickyHeader = (sticky: boolean) => {
		setHeaderSticky(sticky)
		Cookies.set(STICKY_HEADER_COOKIE_KEY, sticky ? 'true' : 'false', {
			expires: 30,
		})
	}

	const handleHomeSidebarDock = (side: HomeSidebarDockSide) => {
		if (!canUsePremiumPalettes) return
		setHomeSidebarDockSide(side)
		Cookies.set(HOME_SIDEBAR_DOCK_COOKIE_KEY, side, {
			expires: 30,
			path: '/',
		})
		router.refresh()
	}

	const handleHomeVideoGrid = (cols: HomeVideoGridColumns) => {
		if (!canUsePremiumPalettes) return
		setHomeVideoColumns(cols)
		Cookies.set(HOME_VIDEO_GRID_COOKIE_KEY, String(cols), {
			expires: 30,
			path: '/',
		})
		router.refresh()
	}

	useEffect(() => {
		const cookieAppearance = Cookies.get('appearance')
		if (cookieAppearance === 'light' || cookieAppearance === 'dark') {
			setActiveAppearance(cookieAppearance)
			applyAppearanceToDocument(cookieAppearance)
			return
		}
		if (userData?.appearance) {
			const mode = appearanceFromApi(userData.appearance)
			setActiveAppearance(mode)
			applyAppearanceToDocument(mode)
		}
	}, [userData?.appearance])

	useEffect(() => {
		const cookieTheme = Cookies.get('theme') as THEME_COLORS | undefined

		if (userData?.theme) {
			const apiTheme = userData.theme as THEME_COLORS

			const stalePremiumMismatch =
				Boolean(userData.isPremium) &&
				cookieTheme !== undefined &&
				isPremiumOnlyTheme(cookieTheme) &&
				apiTheme !== cookieTheme

			const effectiveTheme = stalePremiumMismatch ? cookieTheme : apiTheme

			setActiveColor(effectiveTheme)
			const customPayload =
				effectiveTheme === THEME_COLORS.CUSTOM
					? (userData.customTheme ??
						readCustomPayloadFromCookie() ?? {
							background: DEFAULT_CUSTOM_BG,
							primary: DEFAULT_CUSTOM_PRIMARY,
						})
					: null
			applyThemeClassOnDocument(effectiveTheme, customPayload)

			if (!stalePremiumMismatch) {
				Cookies.set('theme', effectiveTheme, { expires: 30 })
			}
			return
		}

		if (
			cookieTheme &&
			(ALL_THEME_SWATCHES.some((c) => c.color === cookieTheme) ||
				cookieTheme === THEME_COLORS.CUSTOM)
		) {
			setActiveColor(cookieTheme)
			if (cookieTheme === THEME_COLORS.CUSTOM) {
				const payload = readCustomPayloadFromCookie() ?? {
					background: DEFAULT_CUSTOM_BG,
					primary: DEFAULT_CUSTOM_PRIMARY,
				}
				applyThemeClassOnDocument(THEME_COLORS.CUSTOM, payload)
			} else {
				applyThemeClassOnDocument(cookieTheme)
			}
		}
	}, [userData?.theme, userData?.isPremium, userData?.customTheme])

	useEffect(() => {
		if (!userData || userData.isPremium) return
		const cookieTheme = Cookies.get('theme') as THEME_COLORS | undefined
		if (!cookieTheme || !isPremiumOnlyTheme(cookieTheme)) return
		const fallback = userData.theme as THEME_COLORS
		Cookies.set('theme', fallback, { expires: 30 })
		applyThemeClassOnDocument(fallback)
		setActiveColor(fallback)
		router.refresh()
	}, [userData, router])

	useEffect(() => {
		if (!userData || userData.isPremium) return
		let changed = false
		const dock = parseHomeSidebarDockCookie(Cookies.get(HOME_SIDEBAR_DOCK_COOKIE_KEY))
		if (dock !== DEFAULT_HOME_SIDEBAR_DOCK_SIDE) {
			setHomeSidebarDockSide(DEFAULT_HOME_SIDEBAR_DOCK_SIDE)
			Cookies.set(HOME_SIDEBAR_DOCK_COOKIE_KEY, DEFAULT_HOME_SIDEBAR_DOCK_SIDE, {
				expires: 30,
				path: '/',
			})
			changed = true
		}
		const cols = parseHomeVideoGridCookie(Cookies.get(HOME_VIDEO_GRID_COOKIE_KEY))
		if (cols !== DEFAULT_HOME_VIDEO_GRID_COLUMNS) {
			setHomeVideoColumns(DEFAULT_HOME_VIDEO_GRID_COLUMNS)
			Cookies.set(HOME_VIDEO_GRID_COOKIE_KEY, String(DEFAULT_HOME_VIDEO_GRID_COLUMNS), {
				expires: 30,
				path: '/',
			})
			changed = true
		}
		if (changed) router.refresh()
	}, [
		userData,
		userData?.isPremium,
		router,
		setHomeSidebarDockSide,
		setHomeVideoColumns,
	])

	useEffect(() => {
		const localeFromCookie = Cookies.get('locale') as 'uk' | 'en' | undefined
		if (localeFromCookie) {
			setActiveLocale(localeFromCookie)
		}
	}, [])

	const customThemeEditorBody = (
		<div className='space-y-3'>
			<div className='relative'>
				<div
					aria-hidden
					className='pointer-events-none absolute -inset-0.5 rounded-[0.875rem] bg-gradient-to-br from-amber-400/40 via-transparent to-indigo-500/30 opacity-90 dark:from-amber-500/33 dark:to-indigo-400/22'
				/>
				<div
					className='relative overflow-hidden rounded-xl border border-white/28 shadow-[inset_0_1px_0_0_rgb(255,255,255,0.18),0_14px_40px_-26px_rgb(0,0,0,0.5)] ring-1 ring-black/[0.07] dark:border-white/10 dark:ring-white/[0.07]'
					style={{
						backgroundColor: draftBgHex,
						color: foregroundForBackground(draftBgHex),
					}}
				>
					<div
						className='pointer-events-none absolute inset-0 bg-gradient-to-br from-white/[0.12] via-transparent to-black/[0.14]'
						aria-hidden
					/>
					<div className='relative px-3 py-2.5'>
						<div className='mb-2 flex items-center gap-2'>
							<span className='inline-flex items-center rounded-full bg-black/14 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.1em] text-current opacity-88 dark:bg-white/10'>
								{t('uiConfigurator.customThemePreviewCaption')}
							</span>
						</div>
						<div className='flex flex-wrap items-center gap-2'>
							<button
								type='button'
								className='rounded-lg px-3 py-1.5 text-[11px] font-bold shadow-[0_3px_12px_-2px_rgb(0,0,0,0.32)] ring-[1.5px] ring-black/14 transition-[transform,opacity] hover:brightness-105 active:scale-[0.99] dark:ring-white/22'
								style={{
									backgroundColor: draftPrimaryHex,
									color: foregroundForPrimary(draftPrimaryHex),
								}}
							>
								{t('uiConfigurator.customThemePreviewButton')}
							</button>
							<span
								className='cursor-default text-[12px] font-semibold underline decoration-2 underline-offset-4'
								style={{ color: draftPrimaryHex }}
							>
								{t('uiConfigurator.customThemePreviewLink')}
							</span>
						</div>
					</div>
				</div>
			</div>

			<div
				className='flex rounded-lg bg-muted/70 p-0.5 ring-1 ring-border/55 dark:bg-muted/40'
				role='tablist'
				aria-label={t('uiConfigurator.customThemeTitle')}
			>
				<button
					type='button'
					role='tab'
					aria-selected={customEditorChannel === 'background'}
					onClick={() => setCustomEditorChannel('background')}
					className={cn(
						'cursor-pointer flex-1 rounded-md px-2 py-1.5 text-[11px] font-semibold transition-colors',
						'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0',
						customEditorChannel === 'background'
							? 'bg-background text-foreground shadow-sm ring-1 ring-border/65'
							: 'text-muted-foreground hover:bg-background/65 hover:text-foreground',
					)}
				>
					{t('uiConfigurator.customThemeBackground')}
				</button>
				<button
					type='button'
					role='tab'
					aria-selected={customEditorChannel === 'accent'}
					onClick={() => setCustomEditorChannel('accent')}
					className={cn(
						'cursor-pointer flex-1 rounded-md px-2 py-1.5 text-[11px] font-semibold transition-colors',
						'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0',
						customEditorChannel === 'accent'
							? 'bg-background text-foreground shadow-sm ring-1 ring-border/65'
							: 'text-muted-foreground hover:bg-background/65 hover:text-foreground',
					)}
				>
					{t('uiConfigurator.customThemeAccent')}
				</button>
			</div>

			<div className='rounded-xl border border-border/55 bg-gradient-to-b from-muted/42 to-muted/12 p-px shadow-inner ring-1 ring-border/30 dark:border-border/33 dark:from-muted/23 dark:to-muted/8'>
				{customEditorChannel === 'background' ? (
					<div className='rounded-[0.6875rem] bg-background/72 px-3 py-2.5 dark:bg-background/52'>
						<div className='mb-2 flex items-center justify-between gap-2'>
							<span className='text-[12px] font-semibold text-foreground'>
								{t('uiConfigurator.customThemeBackground')}
							</span>
							<code className='rounded-md border border-border/45 bg-muted/35 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground'>
								{draftBgHex}
							</code>
						</div>
						<div className='space-y-2'>
							<CustomThemeModalRange
								channel='H'
								min={0}
								max={360}
								value={draftBgHsl.h}
								accentHex={draftPrimaryHex}
								onChange={(v) => setDraftBgHsl((p) => ({ ...p, h: v }))}
								formatValue={(v) => `${v}°`}
							/>
							<CustomThemeModalRange
								channel='S'
								min={0}
								max={100}
								value={draftBgHsl.s}
								accentHex={draftPrimaryHex}
								onChange={(v) => setDraftBgHsl((p) => ({ ...p, s: v }))}
								formatValue={(v) => `${v}%`}
							/>
							<CustomThemeModalRange
								channel='L'
								min={0}
								max={100}
								value={draftBgHsl.l}
								accentHex={draftPrimaryHex}
								onChange={(v) => setDraftBgHsl((p) => ({ ...p, l: v }))}
								formatValue={(v) => `${v}%`}
							/>
						</div>
					</div>
				) : (
					<div className='rounded-[0.6875rem] bg-background/72 px-3 py-2.5 dark:bg-background/52'>
						<div className='mb-2 flex items-center justify-between gap-2'>
							<span className='text-[12px] font-semibold text-foreground'>
								{t('uiConfigurator.customThemeAccent')}
							</span>
							<code className='rounded-md border border-border/45 bg-muted/35 px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground'>
								{draftPrimaryHex}
							</code>
						</div>
						<div className='space-y-2'>
							<CustomThemeModalRange
								channel='H'
								min={0}
								max={360}
								value={draftPrimaryHsl.h}
								accentHex={draftPrimaryHex}
								onChange={(v) =>
									setDraftPrimaryHsl((p) => ({
										...p,
										h: v,
									}))
								}
								formatValue={(v) => `${v}°`}
							/>
							<CustomThemeModalRange
								channel='S'
								min={0}
								max={100}
								value={draftPrimaryHsl.s}
								accentHex={draftPrimaryHex}
								onChange={(v) =>
									setDraftPrimaryHsl((p) => ({
										...p,
										s: v,
									}))
								}
								formatValue={(v) => `${v}%`}
							/>
							<CustomThemeModalRange
								channel='L'
								min={0}
								max={100}
								value={draftPrimaryHsl.l}
								accentHex={draftPrimaryHex}
								onChange={(v) =>
									setDraftPrimaryHsl((p) => ({
										...p,
										l: v,
									}))
								}
								formatValue={(v) => `${v}%`}
							/>
						</div>
					</div>
				)}
			</div>
		</div>
	)

	return (
		<>
			<Dialog
				open={customThemeEditorOpen}
				onOpenChange={setCustomThemeEditorOpen}
			>
				<DialogContent className='z-[10100] flex max-h-none w-[calc(100%-1.5rem)] max-w-none flex-col gap-0 overflow-hidden rounded-2xl border border-border/60 p-0 shadow-2xl sm:max-w-[400px]'>
					<div className='relative shrink-0 overflow-hidden border-b border-border/50 bg-gradient-to-br from-amber-500/[0.14] via-background to-indigo-500/[0.1] px-5 pb-4 pt-5 dark:from-amber-500/9'>
						<div
							className='pointer-events-none absolute -right-10 -top-16 size-52 rounded-full bg-amber-400/25 blur-3xl dark:bg-amber-400/18'
							aria-hidden
						/>
						<div
							className='pointer-events-none absolute -bottom-20 -left-12 size-48 rounded-full bg-indigo-500/20 blur-3xl dark:bg-indigo-400/14'
							aria-hidden
						/>
						<DialogHeader className='relative text-left'>
							<div className='mb-2 inline-flex'>
								<span className='flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400/90 to-orange-600/95 text-black shadow-[0_10px_26px_-8px_rgb(251,146,60,0.42)]'>
									<Sparkles
										className='size-[1.125rem]'
										aria-hidden
										strokeWidth={2.2}
									/>
								</span>
							</div>
							<DialogTitle className='text-lg font-bold tracking-tight'>
								{t('uiConfigurator.customThemeTitle')}
							</DialogTitle>
							<DialogDescription className='text-left text-[12px] leading-snug text-muted-foreground'>
								{t('uiConfigurator.customThemeHint')}
							</DialogDescription>
						</DialogHeader>
					</div>

					<div className='overflow-hidden px-5 py-3'>
						{customThemeEditorBody}
					</div>

					<DialogFooter className='shrink-0 border-t border-border/50 bg-muted/22 px-5 py-3 dark:bg-muted/12'>
						<Button
							type='button'
							variant='outline'
							className='rounded-xl border-border/70'
							disabled={isSavingCustomTheme}
							onClick={() => setCustomThemeEditorOpen(false)}
						>
							{t('uiConfigurator.customThemeCancel')}
						</Button>
						<Button
							type='button'
							disabled={isSavingCustomTheme || !canUsePremiumPalettes}
							onClick={() => void commitCustomTheme()}
							className='rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 font-semibold text-black shadow-lg shadow-amber-500/35 hover:from-amber-400 hover:to-orange-400 hover:text-black disabled:opacity-60 dark:shadow-amber-500/22'
						>
							{isSavingCustomTheme
								? t('uiConfigurator.customThemeSaving')
								: t('uiConfigurator.customThemeApply')}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			<Sheet open={isThemesMenuOpened} onOpenChange={setThemeMenuOpened}>
				<SheetContent
					side={homeSidebarDockSide === 'right' ? 'left' : 'right'}
					className={cn(
						'flex w-[300px] flex-col gap-0 overflow-hidden border-border p-0 sm:w-[340px]',
						'bg-background/98 shadow-lg backdrop-blur-md',
					)}
				>
					<div className='relative shrink-0 border-b border-border/60 px-4 pb-3 pt-4'>
						<SheetHeader className='space-y-0.5 text-left'>
							<div className='flex items-center gap-2'>
								<span className='flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary ring-1 ring-primary/15'>
									<Palette className='size-4' aria-hidden />
								</span>
								<div className='min-w-0 flex-1'>
									<SheetTitle className='text-base font-semibold leading-tight'>
										{t('uiConfigurator.title')}
									</SheetTitle>
									<p className='text-[11px] leading-snug text-muted-foreground'>
										{t('uiConfigurator.subtitle')}
									</p>
								</div>
							</div>
						</SheetHeader>
					</div>

					<div className='flex flex-1 flex-col gap-3 overflow-y-auto px-4 py-3'>
						<PanelSection icon={Languages} label={t('uiConfigurator.language')}>
							<div
								className='flex rounded-lg bg-muted/80 p-0.5 ring-1 ring-border/60 dark:bg-muted/40'
								role='group'
								aria-label={t('uiConfigurator.language')}
							>
								<button
									type='button'
									onClick={() => handleChangeLanguage('uk')}
									aria-pressed={activeLocale === 'uk'}
									className={cn(
										'cursor-pointer flex flex-1 items-center justify-center rounded-md px-2 py-1.5 text-xs font-semibold transition-colors',
										'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background',
										activeLocale === 'uk'
											? 'bg-background text-foreground shadow-sm ring-1 ring-border/70'
											: 'text-muted-foreground hover:bg-background/60 hover:text-foreground',
									)}
								>
									UA
								</button>
								<button
									type='button'
									onClick={() => handleChangeLanguage('en')}
									aria-pressed={activeLocale === 'en'}
									className={cn(
										'cursor-pointer flex flex-1 items-center justify-center rounded-md px-2 py-1.5 text-xs font-semibold transition-colors',
										'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background',
										activeLocale === 'en'
											? 'bg-background text-foreground shadow-sm ring-1 ring-border/70'
											: 'text-muted-foreground hover:bg-background/60 hover:text-foreground',
									)}
								>
									EN
								</button>
							</div>
						</PanelSection>

						<PanelSection icon={Sun} label={t('uiConfigurator.appearance')}>
							<div
								className='flex rounded-lg bg-muted/80 p-0.5 ring-1 ring-border/60 dark:bg-muted/40'
								role='group'
								aria-label={t('uiConfigurator.appearance')}
							>
								<button
									type='button'
									onClick={() => handleAppearance('light')}
									aria-pressed={activeAppearance === 'light'}
									className={cn(
										'cursor-pointer flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium transition-colors',
										'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background',
										activeAppearance === 'light'
											? 'bg-background text-foreground shadow-sm ring-1 ring-border/70'
											: 'text-muted-foreground hover:bg-background/60 hover:text-foreground',
									)}
								>
									<Sun className='size-3.5 shrink-0' aria-hidden />
									{t('uiConfigurator.appearanceLight')}
								</button>
								<button
									type='button'
									onClick={() => handleAppearance('dark')}
									aria-pressed={activeAppearance === 'dark'}
									className={cn(
										'cursor-pointer flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium transition-colors',
										'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background',
										activeAppearance === 'dark'
											? 'bg-background text-foreground shadow-sm ring-1 ring-border/70'
											: 'text-muted-foreground hover:bg-background/60 hover:text-foreground',
									)}
								>
									<Moon className='size-3.5 shrink-0' aria-hidden />
									{t('uiConfigurator.appearanceDark')}
								</button>
							</div>
						</PanelSection>

						<PanelSection
							icon={PanelTop}
							label={t('uiConfigurator.stickyHeader')}
						>
							<div
								className='flex rounded-lg bg-muted/80 p-0.5 ring-1 ring-border/60 dark:bg-muted/40'
								role='group'
								aria-label={t('uiConfigurator.stickyHeader')}
							>
								<button
									type='button'
									onClick={() => handleStickyHeader(true)}
									aria-pressed={headerSticky}
									className={cn(
										'cursor-pointer flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium transition-colors',
										'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background',
										headerSticky
											? 'bg-background text-foreground shadow-sm ring-1 ring-border/70'
											: 'text-muted-foreground hover:bg-background/60 hover:text-foreground',
									)}
								>
									<PanelTop className='size-3.5 shrink-0' aria-hidden />
									{t('uiConfigurator.stickyHeaderSticky')}
								</button>
								<button
									type='button'
									onClick={() => handleStickyHeader(false)}
									aria-pressed={!headerSticky}
									className={cn(
										'cursor-pointer flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium transition-colors',
										'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background',
										!headerSticky
											? 'bg-background text-foreground shadow-sm ring-1 ring-border/70'
											: 'text-muted-foreground hover:bg-background/60 hover:text-foreground',
									)}
								>
									<ArrowDownFromLine
										className='size-3.5 shrink-0'
										aria-hidden
									/>
									{t('uiConfigurator.stickyHeaderScroll')}
								</button>
							</div>
						</PanelSection>

						<PanelSection
							icon={Palette}
							label={t('uiConfigurator.themeColors')}
						>
							<div className='grid grid-cols-6 gap-2'>
								{UIConfiguratorColors.map((item, index) => (
									<ThemeSwatchButton
										key={`std-${item.color}-${index}`}
										item={item}
										active={activeColor === item.color}
										onPick={() => handleClickColor(item.color)}
									/>
								))}
							</div>
							<>
								<p
									className={cn(
										'mt-2.5 mb-1 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide',
										canUsePremiumPalettes
											? 'text-amber-600 dark:text-amber-400'
											: 'text-muted-foreground',
									)}
								>
									<Crown className='size-3 shrink-0' aria-hidden />
									{t('uiConfigurator.premiumPalettes')}
								</p>
								<div className='grid grid-cols-6 gap-2'>
									{UIConfiguratorPremiumColors.map((item, index) => (
										<ThemeSwatchButton
											key={`prem-${item.color}-${index}`}
											item={{
												...item,
												previewColors: premiumPreviewStrip(
													item.color,
													activeAppearance === 'dark',
												),
											}}
											active={activeColor === item.color}
											disabled={!canUsePremiumPalettes}
											title={
												canUsePremiumPalettes
													? undefined
													: t('uiConfigurator.premiumPaletteLocked')
											}
											onPick={() => handleClickColor(item.color)}
										/>
									))}
								</div>
								{!canUsePremiumPalettes ? (
									<p className='mt-2 text-[10px] leading-snug text-muted-foreground'>
										{t('uiConfigurator.premiumPalettesHint')}
									</p>
								) : null}

								{canUsePremiumPalettes ? (
									<div className='mt-3 rounded-lg border border-amber-400/30 bg-gradient-to-br from-amber-500/[0.06] to-muted/25 px-3 py-2.5 shadow-[inset_0_1px_0_0_rgba(250,204,21,0.08)] dark:border-amber-400/18 dark:from-amber-400/[0.07] dark:to-muted/15 dark:shadow-[inset_0_1px_0_0_rgba(253,224,71,0.04)]'>
										<p className='mb-2 text-[10px] font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-400'>
											{t('uiConfigurator.customThemeTitle')}
										</p>
										<div className='flex items-center gap-3'>
											<CustomThemeSwatchCircle
												className='mx-0 shrink-0'
												payload={swatchCustomPayload}
												active={activeColor === THEME_COLORS.CUSTOM}
												disabled={!canUsePremiumPalettes || isSavingCustomTheme}
												title={
													canUsePremiumPalettes
														? t('uiConfigurator.customThemeSwatchPick')
														: t('uiConfigurator.premiumPaletteLocked')
												}
												onPick={() => void selectStoredCustomTheme()}
											/>
											<Button
												type='button'
												variant='outline'
												size='sm'
												className='h-8 shrink-0 border-amber-400/40 bg-amber-500/[0.06] px-3 text-[11px] font-medium text-amber-900 hover:bg-amber-500/10 dark:border-amber-400/28 dark:bg-amber-400/10 dark:text-amber-100 dark:hover:bg-amber-400/14'
												onClick={openCustomThemeEditor}
											>
												<SlidersHorizontal
													className='mr-1.5 size-3.5'
													aria-hidden
												/>
												{t('uiConfigurator.customThemeEdit')}
											</Button>
										</div>
										<p className='mt-2 text-[10px] leading-snug text-muted-foreground'>
											{t('uiConfigurator.customThemeTeaser')}
										</p>
									</div>
								) : null}
							</>
						</PanelSection>

						<PanelSection
							icon={PanelLeft}
							label={t('uiConfigurator.sidebarDock')}
							premiumChrome
						>
							<p
								className={cn(
									'mb-1.5 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide',
									canUsePremiumPalettes
										? 'text-amber-700 dark:text-amber-400'
										: 'text-muted-foreground',
								)}
							>
								<Crown className='size-3 shrink-0' aria-hidden />
								{t('uiConfigurator.homeVideoGridPremiumOnly')}
							</p>
							<p className='mb-2 text-[10px] leading-snug text-muted-foreground'>
								{t('uiConfigurator.sidebarDockHint')}
							</p>
							{!canUsePremiumPalettes ? (
								<p className='mb-2 text-[10px] leading-snug text-amber-900/80 dark:text-amber-200/80'>
									{t('uiConfigurator.sidebarDockPremiumHint')}
								</p>
							) : null}
							<div
								className='flex rounded-lg bg-muted/80 p-0.5 ring-1 ring-border/60 dark:bg-muted/40'
								role='group'
								aria-label={t('uiConfigurator.sidebarDock')}
							>
								<button
									type='button'
									disabled={!canUsePremiumPalettes}
									onClick={() => handleHomeSidebarDock('left')}
									aria-pressed={homeSidebarDockSide === 'left'}
									className={cn(
										'flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium transition-colors',
										'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background',
										canUsePremiumPalettes
											? 'cursor-pointer'
											: 'cursor-not-allowed opacity-[0.42] saturate-[0.65]',
										homeSidebarDockSide === 'left' && canUsePremiumPalettes
											? 'bg-background text-foreground shadow-sm ring-1 ring-border/70'
											: homeSidebarDockSide === 'left'
												? 'bg-muted/55 text-muted-foreground ring-1 ring-border/40'
												: canUsePremiumPalettes
													? 'text-muted-foreground hover:bg-background/60 hover:text-foreground'
													: 'text-muted-foreground',
									)}
								>
									<PanelLeft className='size-3.5 shrink-0' aria-hidden />
									{t('uiConfigurator.sidebarDockLeft')}
								</button>
								<button
									type='button'
									disabled={!canUsePremiumPalettes}
									onClick={() => handleHomeSidebarDock('right')}
									aria-pressed={homeSidebarDockSide === 'right'}
									className={cn(
										'flex flex-1 items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-xs font-medium transition-colors',
										'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background',
										canUsePremiumPalettes
											? 'cursor-pointer'
											: 'cursor-not-allowed opacity-[0.42] saturate-[0.65]',
										homeSidebarDockSide === 'right' && canUsePremiumPalettes
											? 'bg-background text-foreground shadow-sm ring-1 ring-border/70'
											: homeSidebarDockSide === 'right'
												? 'bg-muted/55 text-muted-foreground ring-1 ring-border/40'
												: canUsePremiumPalettes
													? 'text-muted-foreground hover:bg-background/60 hover:text-foreground'
													: 'text-muted-foreground',
									)}
								>
									<PanelRight className='size-3.5 shrink-0' aria-hidden />
									{t('uiConfigurator.sidebarDockRight')}
								</button>
							</div>
						</PanelSection>

						<PanelSection
							icon={LayoutGrid}
							label={t('uiConfigurator.homeVideoGridTitle')}
							premiumChrome
						>
							<p
								className={cn(
									'mb-1.5 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide',
									canUsePremiumPalettes
										? 'text-amber-700 dark:text-amber-400'
										: 'text-muted-foreground',
								)}
							>
								<Crown className='size-3 shrink-0' aria-hidden />
								{t('uiConfigurator.homeVideoGridPremiumOnly')}
							</p>
							<p className='mb-2 text-[10px] leading-snug text-muted-foreground'>
								{t('uiConfigurator.homeVideoGridHint')}
							</p>
							{!canUsePremiumPalettes ? (
								<p className='mb-2 text-[10px] leading-snug text-amber-900/80 dark:text-amber-200/80'>
									{t('uiConfigurator.homeVideoGridPremiumHint')}
								</p>
							) : null}
							<div
								className='grid grid-cols-4 gap-1.5'
								role='radiogroup'
								aria-label={t('uiConfigurator.homeVideoGridTitle')}
							>
								{HOME_VIDEO_GRID_COLUMNS.map((n) => (
									<button
										key={n}
										type='button'
										role='radio'
										disabled={!canUsePremiumPalettes}
										aria-checked={homeVideoColumns === n}
										aria-label={t('uiConfigurator.homeVideoGridAriaN', { n })}
										onClick={() => handleHomeVideoGrid(n)}
										className={cn(
											'rounded-lg px-1 py-2 text-center text-sm font-semibold tabular-nums transition-colors',
											'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background',
											canUsePremiumPalettes
												? 'cursor-pointer'
												: 'cursor-not-allowed opacity-[0.42] saturate-[0.65]',
											homeVideoColumns === n && canUsePremiumPalettes
												? 'bg-primary text-primary-foreground shadow-sm ring-2 ring-primary/35'
												: homeVideoColumns === n
													? 'bg-muted/55 text-muted-foreground ring-1 ring-border/40'
													: 'bg-muted/75 text-muted-foreground ring-1 ring-border/55 hover:bg-muted hover:text-foreground dark:bg-muted/40',
										)}
									>
										{n}
									</button>
								))}
							</div>
						</PanelSection>
					</div>
				</SheetContent>
			</Sheet>
		</>
	)
}
