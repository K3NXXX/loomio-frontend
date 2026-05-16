import {
	AVATAR_FRAME_STYLE_VALUES,
	AVATAR_FRAME_THICKNESS_VALUES,
} from '@/constants/avatar-frame.constants'
import { z } from 'zod'

const bannerFileSchema = z
	.custom<File>((v) => v instanceof File, { message: 'Invalid file' })
	.superRefine((f, ctx) => {
		if (!f.type.startsWith('image/')) {
			ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'File must be an image' })
			return
		}
		const isGif = f.type === 'image/gif' || f.name.toLowerCase().endsWith('.gif')
		const maxMb = isGif ? 12 : 6
		if (f.size > maxMb * 1024 * 1024) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: `File size must be ≤ ${maxMb} MB`,
			})
		}
	})

export const editingChannelSchema = z.object({
	name: z
		.string()
		.nonempty({ message: 'Channel name is required' })
		.min(2, { message: 'Channel name must be at least 2 characters' }),

	username: z
		.string()
		.nonempty({ message: 'Channel username is required' })
		.min(3, { message: 'Username must be at least 3 characters' }),

	description: z
		.string()
		.max(1000, { message: 'Description must be at most 1000 characters' })
		.optional(),

	avatarFile: z.instanceof(File).optional(),
	bannerFile: bannerFileSchema.optional().or(z.undefined()),

	bannerUrl: z.string().optional(),

	removeAvatar: z.boolean().optional().default(false),
	removeBanner: z.boolean().optional().default(false),

	avatarFrameColor: z
		.string()
		.optional()
		.refine(
			(v) => v === undefined || v === '' || /^#[0-9A-Fa-f]{6}$/.test(v),
			{ message: 'Invalid frame color' },
		),

	avatarFrameThickness: z
		.string()
		.optional()
		.refine(
			(v) =>
				v === undefined ||
				v === '' ||
				(AVATAR_FRAME_THICKNESS_VALUES as readonly string[]).includes(v),
			{ message: 'Invalid frame thickness' },
		),

	avatarFrameStyle: z
		.string()
		.optional()
		.refine(
			(v) =>
				v === undefined ||
				v === '' ||
				(AVATAR_FRAME_STYLE_VALUES as readonly string[]).includes(v),
			{ message: 'Invalid frame style' },
		),
})

export type TEditingChannelSchema = z.infer<typeof editingChannelSchema>
