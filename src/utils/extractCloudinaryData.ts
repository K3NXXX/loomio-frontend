export const extractCloudinaryData = (url: string) => {
	try {
		const match = url.match(
			/res\.cloudinary\.com\/([^/]+)\/video\/upload\/(v\d+)\/(.+)\.mp4/,
		)
		if (!match) return null

		const [, cloud, version, publicId] = match
		return { cloud, version, publicId }
	} catch {
		return null
	}
}
