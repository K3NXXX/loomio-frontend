import { z } from 'zod'

export const createChannelSchema = z.object({
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

	avatar: z.string().url({ message: 'Invalid avatar URL' }).optional(),
})

export type CreateChannelSchema = z.infer<typeof createChannelSchema>
