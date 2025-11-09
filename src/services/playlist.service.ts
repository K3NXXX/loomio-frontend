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
		const { data } = await axiosInstance.post<{ success: boolean }>(
			`${this.BASE_URL}`,
			playlistData,
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
		const { data } = await axiosInstance.patch(
			`${this.BASE_URL}/${playlistId}`,
			editContent,
		)
		return data
	}
}

export const playlistService = new PlaylistService()
