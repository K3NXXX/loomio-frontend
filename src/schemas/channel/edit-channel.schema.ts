import { z } from 'zod'

const imageMime = z
	.string()
	.regex(/^image\//, { message: 'File must be an image' })

const fileBase = z.custom<File>((v) => v instanceof File, {
	message: 'File is required',
})

const imageFile = fileBase.refine((f) => imageMime.safeParse(f.type).success, {
	message: 'File must be an image',
})

const fileMaxMB = (mb: number) =>
	imageFile.refine((f) => f.size <= mb * 1024 * 1024, {
		message: `File size must be ≤ ${mb} MB`,
	})

const avatarFileSchema = fileMaxMB(4).refine(
	(f) => ['image/png', 'image/gif'].includes(f.type),
	{ message: 'Avatar must be PNG or GIF' },
)

const bannerFileSchema = fileMaxMB(6)

export const editingChannelSchema = z.object({
	name: z
		.string()
		.nonempty({ message: 'Channel name is required' })
		.min(2, { message: 'Channel name must be at least 2 characters' })
		.max(50, { message: 'Channel name must be less than 50 characters' })
		.regex(/^[a-zA-Zа-яА-ЯёЁіІїЇєЄґҐ0-9\s'’`-]+$/, {
			message:
				'Name can contain only letters, numbers, spaces, apostrophes, or dashes',
		}),

	username: z
		.string()
		.nonempty({ message: 'Username is required' })
		.min(3, { message: 'Username must be at least 3 characters' })
		.max(20, { message: 'Username must be at most 20 characters' })
		.regex(/^[a-z0-9_]+$/, {
			message:
				'Username must contain only lowercase letters, numbers, and underscores',
		}),

	description: z
		.string()
		.trim()
		.max(1000, { message: 'Description must be at most 1000 characters' })
		.optional()
		.or(z.literal('')),

	avatarFile: z.union([avatarFileSchema, z.undefined()]).optional(),
	bannerFile: z.union([bannerFileSchema, z.undefined()]).optional(),
})

export type TEditingChannelSchema = z.infer<typeof editingChannelSchema>
