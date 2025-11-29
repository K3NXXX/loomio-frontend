import axiosInstance from '@/lib/axios'

import type {
	ICreateReportResponse,
	IReportCommentRequest,
	IReportVideoRequest,
} from '@/types/report.types'

class ReportService {
	private BASE_URL = `${process.env.NEXT_PUBLIC_API_URL!}/reports`

	async reportComment(
		payload: IReportCommentRequest,
	): Promise<ICreateReportResponse> {
		const { commentId, reason, message } = payload

		const { data } = await axiosInstance.post<ICreateReportResponse>(
			this.BASE_URL,
			{
				commentId,
				reason,
				message,
			},
		)

		return data
	}

	async reportVideo(
		payload: IReportVideoRequest,
	): Promise<ICreateReportResponse> {
		const { videoId, reason, message } = payload

		const { data } = await axiosInstance.post<ICreateReportResponse>(
			this.BASE_URL,
			{
				videoId,
				reason,
				message,
			},
		)

		return data
	}
}

export const reportService = new ReportService()
