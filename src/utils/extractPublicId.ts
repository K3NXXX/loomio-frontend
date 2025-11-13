export function extractPublicId(fullUrl: string) {
	// Напр.:
	// https://res.cloudinary.com/drsdieji1/video/upload/v1762599095/videos/byntkw7x07sc6l7rn1sv.mp4
	// → videos/byntkw7x07sc6l7rn1sv

	try {
		const partAfterUpload = fullUrl.split('/upload/')[1] // v176..../videos/xxxx.mp4
		const withoutVersion = partAfterUpload.split('/').slice(1).join('/') // videos/xxxx.mp4
		return withoutVersion.replace('.mp4', '') // videos/xxxx
	} catch {
		return fullUrl // fallback
	}
}
