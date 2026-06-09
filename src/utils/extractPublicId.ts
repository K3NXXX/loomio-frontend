export function extractPublicId(fullUrl: string) {
	try {
		const partAfterUpload = fullUrl.split('/upload/')[1]
		const withoutVersion = partAfterUpload.split('/').slice(1).join('/')
		return withoutVersion.replace('.mp4', '')
	} catch {
		return fullUrl
	}
}
