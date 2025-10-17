import axiosInstance from '@/lib/axios'
import type {
	ICreateCommentRequest,
	IEditCommentResponse,
	IVideoCommentsResponse,
} from '@/types/comment.types'

class CommentService {
	private BASE_URL = `${process.env.NEXT_PUBLIC_API_URL!}/comments`

	async createComment(
		commentData: ICreateCommentRequest,
	): Promise<{ success: boolean }> {
		const { data } = await axiosInstance.post<{ success: boolean }>(
			`${this.BASE_URL}`,
			commentData,
		)
		return data
	}

	async getComments(videoId: string): Promise<IVideoCommentsResponse> {
		const { data } = await axiosInstance.get<IVideoCommentsResponse>(
			`${this.BASE_URL}/video/${videoId}`,
		)
		return data
	}

	async editComment(
		commentData: IEditCommentResponse,
	): Promise<{ message: string }> {
		const { commentId, ...body } = commentData
		const { data } = await axiosInstance.patch<{ message: string }>(
			`${this.BASE_URL}/${commentId}`,
			body,
		)
		return data
	}

	async deleteComment(commentId: string): Promise<{ message: string }> {
		const { data } = await axiosInstance.delete<{ message: string }>(
			`${this.BASE_URL}/${commentId}`,
		)
		return data
	}
}

export const commentService = new CommentService()
