import { z } from 'zod'
import { uploadVideoSchema } from './upload-video.schema'

export const editVideoSchema = uploadVideoSchema
	.omit({ file: true })
	.partial({
		thumbnail: true,
		publishType: true,
		publishDate: true,
	})
	.superRefine((data, ctx) => {
		if (data.publishType === 'scheduled' && !data.publishDate) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message: 'Publish date is required when scheduling a video',
				path: ['publishDate'],
			})
		}
	})

export type TEditVideoSchema = z.infer<typeof editVideoSchema>
