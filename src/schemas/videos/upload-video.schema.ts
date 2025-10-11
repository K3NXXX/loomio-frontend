import { z } from 'zod'

export const uploadVideoSchema = z.object({
	title: z
		.string()
		.min(3, 'Title must be at least 3 characters')
		.max(200, { message: 'Title must be less than 200 characters' }),
	description: z
		.string()
		.trim()
		.max(1000, { message: 'Description must be less than 1000 characters' })
		.optional(),
	tags: z
		.string()
		.optional()
		.refine(
			(val) => {
				if (!val || val.trim() === '') return true
				const regex = /^#\w+( #\w+)*$/
				return regex.test(val.trim())
			},
			{
				message: 'Invalid tags format',
			},
		),
	file: z
		.array(z.instanceof(File))
		.min(1, { message: 'Video file is required' }),

	thumbnail: z
		.array(z.instanceof(File))
		.min(1, { message: 'Thumbnail is required' }),

	visibility: z.enum(['public', 'private']).refine((val) => !!val, {
		message: 'Visibility is required',
	}),

	audience: z.enum(['yes', 'no']).refine((val) => !!val, {
		message: 'You must specify if the content is made for kids',
	}),
	publishType: z.enum(['now', 'scheduled']).refine((val) => !!val, {
		message: 'You must choose when to publish',
	}),
	publishDate: z
		.string()
		.optional()
		.superRefine((val, ctx) => {
			const parent = (ctx as any).parent
			const publishType = parent?.publishType

			if (publishType === 'scheduled' && (!val || val.trim().length === 0)) {
				ctx.addIssue({
					code: z.ZodIssueCode.custom,
					message: 'Publish date is required when scheduling',
				})
			}
		}),
})

export type TUploadVideoSchema = z.infer<typeof uploadVideoSchema>
