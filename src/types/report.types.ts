export enum ReportReason {
	HATE_SPEECH = 'HATE_SPEECH',
	HARASSMENT = 'HARASSMENT',
	SPAM = 'SPAM',
	SEXUAL_CONTENT = 'SEXUAL_CONTENT',
	VIOLENCE = 'VIOLENCE',
	OTHER = 'OTHER',
}

export const REPORT_REASON_LABELS: Record<ReportReason, string> = {
	[ReportReason.HATE_SPEECH]: 'Hate speech',
	[ReportReason.HARASSMENT]: 'Harassment or bullying',
	[ReportReason.SPAM]: 'Spam or misleading',
	[ReportReason.SEXUAL_CONTENT]: 'Sexual content',
	[ReportReason.VIOLENCE]: 'Violence or dangerous content',
	[ReportReason.OTHER]: 'Other',
}

export interface IReportCommentRequest {
	commentId: string
	reason: string
	message?: string | null
}

export interface IReportVideoRequest {
	videoId: string
	reason: string
	message?: string | null
}

export interface ICreateReportResponse {
	id: string
	reason: string
	message?: string | null
	videoId?: string
	commentId?: string
	createdAt: string
}
