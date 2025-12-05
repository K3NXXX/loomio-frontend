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

export interface IReportItem {
	id: string
	reason: string
	message: string | null
	createdAt: string

	status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED' | 'REJECTED'
	assignedToId: string | null

	assignedTo?: {
		id: string
		username: string
		avatarUrl: string | null
	} | null

	author: {
		id: string
		username: string
		avatarUrl: string | null
	}

	video?: {
		id: string
		title: string
		thumbnailFile?: string
		channel?: {
			id: string
			username: string
			avatarUrl: string | null
		}
	} | null

	comment?: {
		id: string
		content: string
		user?: {
			id: string
			username: string
			avatarUrl: string | null
		}
	} | null
}

export interface IReportStats {
	total: number
	pending: number
	inProgress: number
	resolved: number
	rejected: number

	videoReports: number
	commentReports: number

	moderatorsWorking: {
		count: number
		user: {
			id: string
			username: string
			avatarUrl: string | null
		}
	}[]

	activeAssignments: {
		id: string
		reason: string
		videoId: string | null
		commentId: string | null
		assignedTo: {
			id: string
			username: string
			avatarUrl: string | null
		} | null
	}[]

	topReporters: {
		authorId: string
		_count: {
			id: number
		}
	}[]
}
