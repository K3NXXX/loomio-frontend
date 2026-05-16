'use client'

import type { CSSProperties, ReactNode } from 'react'

import type { AvatarFrameStyle, AvatarFrameThickness } from '@/constants/avatar-frame.constants'
import { isAvatarFrameStyle, isAvatarFrameThickness } from '@/constants/avatar-frame.constants'
import { cn } from '@/lib/utils'
import { cva, type VariantProps } from 'class-variance-authority'

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
	const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim())
	if (!m) return null
	const n = parseInt(m[1], 16)
	return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 }
}

function customOuterStyle(hex: string, style: AvatarFrameStyle): CSSProperties {
	const rgb = hexToRgb(hex)
	if (!rgb) return {}
	const { r, g, b } = rgb
	const rgba = (a: number) => `rgba(${r},${g},${b},${a})`

	switch (style) {
		case 'solid':
			return { background: `rgb(${r},${g},${b})` }
		case 'double':
			return {
				background: `rgb(${r},${g},${b})`,
				boxShadow: [
					'inset 0 0 0 2px rgba(255,255,255,0.26)',
					`0 0 0 3px rgb(${r},${g},${b})`,
					'0 0 0 5px var(--background)',
					`0 0 0 9px rgb(${r},${g},${b})`,
				].join(', '),
			}
		case 'glow':
			return {
				background: `rgb(${r},${g},${b})`,
				boxShadow: `0 0 14px 3px ${rgba(0.48)}, 0 0 28px ${rgba(0.22)}`,
			}
		case 'gradient':
		default:
			return {
				background: `linear-gradient(135deg, rgb(${r},${g},${b}) 0%, rgba(${r},${g},${b},0.72) 50%, rgba(${r},${g},${b},0.28) 100%)`,
			}
	}
}

function defaultOuterExtraStyle(style: AvatarFrameStyle): CSSProperties | undefined {
	if (style === 'double') {
		return {
			boxShadow: [
				'inset 0 0 0 2px rgba(255,255,255,0.18)',
				'0 0 0 3px color-mix(in oklch, var(--color-primary) 92%, transparent)',
				'0 0 0 5px var(--background)',
				'0 0 0 9px var(--color-primary)',
			].join(', '),
		}
	}
	if (style === 'glow') {
		return {
			boxShadow:
				'0 0 14px 3px color-mix(in oklch, var(--color-primary) 50%, transparent), 0 0 28px color-mix(in oklch, var(--color-primary) 26%, transparent)',
		}
	}
	return undefined
}

const frameOuterShadow = cva('shrink-0 rounded-full', {
	variants: {
		variant: {
			hero: 'shadow-[0_10px_28px_-12px_rgba(0,0,0,0.35)] dark:shadow-[0_10px_32px_-14px_rgba(0,0,0,0.58)]',
			studio:
				'shadow-[0_6px_18px_-8px_rgba(0,0,0,0.28)] dark:shadow-[0_6px_20px_-8px_rgba(0,0,0,0.45)]',
			compact: 'shadow-sm',
			micro: 'shadow-sm',
		},
	},
	defaultVariants: { variant: 'hero' },
})

const RING_PAD_PX: Record<
	NonNullable<VariantProps<typeof frameOuterShadow>['variant']>,
	Record<AvatarFrameThickness, number>
> = {
	hero: { thin: 2, medium: 3, thick: 5 },
	studio: { thin: 1.5, medium: 2.5, thick: 4 },
	compact: { thin: 1, medium: 2, thick: 3 },
	micro: { thin: 0.75, medium: 1, thick: 2 },
}

const frameDefaultGradient =
	'bg-gradient-to-br from-primary via-primary/78 to-primary/32'

const frameInner = cva('rounded-full bg-background ring-1', {
	variants: {
		variant: {
			hero: 'p-[2px]',
			studio: 'p-[1.5px]',
			compact: 'p-px',
			micro: 'p-px',
		},
	},
	defaultVariants: { variant: 'hero' },
})

const frameInnerRingTheme = 'ring-border/60 dark:ring-white/12'
const frameInnerRingCustom = 'ring-black/12 dark:ring-white/15'

export type ChannelAvatarFrameProps = VariantProps<typeof frameOuterShadow> & {
	children: ReactNode
	className?: string
	frameColor?: string | null
	frameThickness?: string | null
	frameStyle?: string | null
}

export function ChannelAvatarFrame({
	children,
	variant = 'hero',
	className,
	frameColor,
	frameThickness,
	frameStyle,
}: ChannelAvatarFrameProps) {
	const v = variant ?? 'hero'
	const hasCustomHex = Boolean(
		frameColor && /^#[0-9A-Fa-f]{6}$/.test(frameColor),
	)

	const thickness: AvatarFrameThickness = isAvatarFrameThickness(frameThickness)
		? frameThickness
		: 'medium'
	const style: AvatarFrameStyle = isAvatarFrameStyle(frameStyle)
		? frameStyle
		: 'gradient'

	const ringPad = RING_PAD_PX[v][thickness]

	let outerStyle: CSSProperties = { padding: ringPad }
	let outerClass = frameOuterShadow({ variant })

	if (hasCustomHex && frameColor) {
		outerClass = cn(frameOuterShadow({ variant }), className)
		outerStyle = { ...outerStyle, ...customOuterStyle(frameColor, style) }
	} else {
		if (style === 'gradient') {
			outerClass = cn(frameOuterShadow({ variant }), frameDefaultGradient, className)
		} else {
			outerClass = cn(frameOuterShadow({ variant }), 'bg-primary', className)
			const extra = defaultOuterExtraStyle(style)
			if (extra) outerStyle = { ...outerStyle, ...extra }
		}
	}

	return (
		<div className={outerClass} style={outerStyle}>
			<div
				className={cn(
					frameInner({ variant }),
					hasCustomHex ? frameInnerRingCustom : frameInnerRingTheme,
				)}
			>
				{children}
			</div>
		</div>
	)
}
