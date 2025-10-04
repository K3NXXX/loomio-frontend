import type { Area } from 'react-easy-crop'

export const getCroppedImg = async (
	imageSrc: string,
	pixelCrop: Area,
): Promise<string | null> => {
	const image = await new Promise<HTMLImageElement>((resolve, reject) => {
		const img = new Image()
		img.src = imageSrc
		img.onload = () => resolve(img)
		img.onerror = (err) => reject(err)
	})

	const canvas = document.createElement('canvas')
	const ctx = canvas.getContext('2d')
	if (!ctx) return null

	canvas.width = pixelCrop.width
	canvas.height = pixelCrop.height

	ctx.drawImage(
		image,
		pixelCrop.x,
		pixelCrop.y,
		pixelCrop.width,
		pixelCrop.height,
		0,
		0,
		pixelCrop.width,
		pixelCrop.height,
	)

	return canvas.toDataURL('image/jpeg')
}
