import { z } from 'zod'

export const editPlaylistSchema = z.object({
	name: z
		.string()
		.nonempty({ message: 'Playlist name is required' })
		.min(2, 'Playlist name must be at least 2 characters')
		.max(100, { message: 'Name must be under 100 characters' }),
	description: z
		.string()
		.max(500, { message: 'Description must be under 500 characters' })
		.optional()
		.or(z.literal('')),
	cover: z.instanceof(File).optional().nullable(),
	removeCover: z.boolean().optional(),
})

export type TEditPlaylistSchema = z.infer<typeof editPlaylistSchema>
