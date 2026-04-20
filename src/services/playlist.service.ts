import axiosInstance from '@/lib/axios'
import type {
	ICreatePlaylistRequest,
	IEditPlaylistRequest,
	IPlaylist,
} from '@/types/playlist.types'

class PlaylistService {
	private BASE_URL = `${process.env.NEXT_PUBLIC_API_URL!}/playlist`

	async createPlaylist(
		playlistData: ICreatePlaylistRequest,
	): Promise<{ success: boolean }> {
		const formData = new FormData()
		formData.append('name', playlistData.name)
		if (playlistData.description) {
			formData.append('description', playlistData.description)
		}
		if (playlistData.cover) {
			formData.append('cover', playlistData.cover)
		}

		const { data } = await axiosInstance.post<{ success: boolean }>(
			`${this.BASE_URL}`,
			formData,
		)
		return data
	}

	async getMyPlaylists(): Promise<IPlaylist[]> {
		const { data } = await axiosInstance.get<IPlaylist[]>(`${this.BASE_URL}/me`)
		return data
	}

	async getOneUserPlaylist(playlistId: string): Promise<IPlaylist> {
		const { data } = await axiosInstance.get<IPlaylist>(
			`${this.BASE_URL}/${playlistId}`,
		)
		return data
	}

	async deletePlaylist(playlistId: string) {
		const { data } = await axiosInstance.delete(
			`${this.BASE_URL}/${playlistId}`,
		)
		return data
	}

	async editPlaylist(playlistId: string, editContent: IEditPlaylistRequest) {
		const formData = new FormData()

		if (editContent.name) {
			formData.append('name', editContent.name)
		}

		if (editContent.description !== undefined) {
			formData.append('description', editContent.description ?? '')
		}

		if (editContent.cover instanceof File) {
			formData.append('cover', editContent.cover)
		}

		if (editContent.removeCover) {
			formData.append('removeCover', 'true')
		}

		const { data } = await axiosInstance.patch(
			`${this.BASE_URL}/${playlistId}`,
			formData,
		)

		return data
	}
}

export const playlistService = new PlaylistService()
