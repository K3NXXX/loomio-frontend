import { ReportReason } from '@/types/report.types'
import { z } from 'zod'

export const reportSchema = z
	.object({
		reason: z
			.nativeEnum(ReportReason, {
				message: 'Select a reason',
			})
			.optional(),

		message: z.string().optional(),
	})
	.refine(
		(data) =>
			data.reason !== ReportReason.OTHER ||
			(data.message && data.message.trim().length > 3),
		{
			path: ['message'],
			message: 'Please provide more details',
		},
	)

export type TReportSchema = z.infer<typeof reportSchema>
