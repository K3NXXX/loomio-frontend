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

const bannerFileSchema = fileMaxMB(6)

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
	bannerFile: bannerFileSchema.optional(),

	bannerUrl: z.string().optional(),

	removeAvatar: z.boolean().optional().default(false),
	removeBanner: z.boolean().optional().default(false),
})

export type TEditingChannelSchema = z.infer<typeof editingChannelSchema>
