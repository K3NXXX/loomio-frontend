export interface IAddVideoRequest {
	file: File
	title: string
	description?: string
	tags?: string
	visibility: 'public' | 'private'
	audience: 'yes' | 'no'
	publishType: 'now' | 'scheduled'
	publishDate?: string
	thumbnail?: File
}
