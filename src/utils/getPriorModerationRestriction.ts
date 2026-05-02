import type { IReportItem } from '@/types/report.types'

/** Restriction context from the last moderator action, stored on the report and/or video snapshot. */
export function getPriorModerationRestriction(report: IReportItem) {
	const reason =
		report.moderatorRestrictionReason ??
		report.video?.restrictionModeratorReason ??
		null

	const note =
		report.moderatorNote?.trim() ||
		report.video?.restrictionModeratorNote?.trim() ||
		null

	return { reason, note }
}
