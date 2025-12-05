import axiosInstance from '@/lib/axios'

import type {
	ICreateReportResponse,
	IReportCommentRequest,
	IReportItem,
	IReportStats,
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

	async getVideoReports(): Promise<IReportItem[]> {
		const { data } = await axiosInstance.get<IReportItem[]>(
			`${this.BASE_URL}/videos`,
		)
		return data
	}

	async getCommentReports(): Promise<IReportItem[]> {
		const { data } = await axiosInstance.get<IReportItem[]>(
			`${this.BASE_URL}/comments`,
		)
		return data
	}

	async getReport(id: string) {
		const { data } = await axiosInstance.get(`${this.BASE_URL}/${id}`)
		return data
	}

	async assignReport(reportId: string) {
		const { data } = await axiosInstance.patch(
			`${this.BASE_URL}/${reportId}/assign`,
		)
		return data
	}

	async approveReport(reportId: string) {
		const { data } = await axiosInstance.post(
			`${this.BASE_URL}/approve/${reportId}`,
		)
		return data
	}

	async deleteComment(reportId: string) {
		const { data } = await axiosInstance.post(
			`${this.BASE_URL}/delete-comment/${reportId}`,
		)
		return data
	}

	async getCommentHistory(): Promise<IReportItem[]> {
		const { data } = await axiosInstance.get<IReportItem[]>(
			`${this.BASE_URL}/comments/history`,
		)
		return data
	}

	async getVideoHistory(): Promise<IReportItem[]> {
		const { data } = await axiosInstance.get<IReportItem[]>(
			`${this.BASE_URL}/videos/history`,
		)
		return data
	}

	async restrictVideo(reportId: string) {
		const { data } = await axiosInstance.post(
			`${this.BASE_URL}/report-video/${reportId}`,
		)
		return data
	}

	async getStats(): Promise<IReportStats> {
		const { data } = await axiosInstance.get<IReportStats>(
			`${this.BASE_URL}/stats`,
		)
		return data
	}

	async requestReview(videoId: string, data: FormData) {
		return axiosInstance.post(`${this.BASE_URL}/review/${videoId}`, data, {
			headers: { 'Content-Type': 'multipart/form-data' },
		})
	}
}

export const reportService = new ReportService()
