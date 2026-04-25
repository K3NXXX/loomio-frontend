import type { Area } from 'react-easy-crop'

type CropOptions = {
	targetWidth?: number
	targetHeight?: number
}

export const getCroppedImg = async (
	imageSrc: string,
	pixelCrop: Area,
	options?: CropOptions,
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

	const width = options?.targetWidth ?? pixelCrop.width
	const height = options?.targetHeight ?? pixelCrop.height

	canvas.width = width
	canvas.height = height

	ctx.drawImage(
		image,
		pixelCrop.x,
		pixelCrop.y,
		pixelCrop.width,
		pixelCrop.height,
		0,
		0,
		width,
		height,
	)

	return canvas.toDataURL('image/jpeg')
}
