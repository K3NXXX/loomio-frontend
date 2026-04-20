import { z } from 'zod'

export const createPlaylistSchema = z.object({
	name: z
		.string()
		.min(2, 'Playlist name must be at least 2 characters')
		.max(100, { message: 'Name must be under 100 characters' }),
	description: z
		.string()
		.max(500, { message: 'Description must be under 500 characters' })
		.optional()
		.or(z.literal('')),
	cover: z.instanceof(File).optional().nullable(),
})

export type TCreatePlaylistSchema = z.infer<typeof createPlaylistSchema>
