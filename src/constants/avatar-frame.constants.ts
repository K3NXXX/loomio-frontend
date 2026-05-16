export const AVATAR_FRAME_THICKNESS_VALUES = ['thin', 'medium', 'thick'] as const
export type AvatarFrameThickness = (typeof AVATAR_FRAME_THICKNESS_VALUES)[number]

export const AVATAR_FRAME_STYLE_VALUES = ['gradient', 'solid', 'double', 'glow'] as const
export type AvatarFrameStyle = (typeof AVATAR_FRAME_STYLE_VALUES)[number]

export function isAvatarFrameThickness(
	v: string | null | undefined,
): v is AvatarFrameThickness {
	return v === 'thin' || v === 'medium' || v === 'thick'
}

export function isAvatarFrameStyle(v: string | null | undefined): v is AvatarFrameStyle {
	return v === 'gradient' || v === 'solid' || v === 'double' || v === 'glow'
}
