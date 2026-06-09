
export function hexToHsl(hex: string): { h: number; s: number; l: number } {
	const { r, g, b } = (() => {
		const h = hex.replace('#', '')
		const n = parseInt(h, 16)
		return { r: (n >> 16) / 255, g: ((n >> 8) & 255) / 255, b: (n & 255) / 255 }
	})()
	const max = Math.max(r, g, b)
	const min = Math.min(r, g, b)
	const d = max - min
	const l = (max + min) / 2
	let h = 0
	let s = 0

	if (d !== 0) {
		s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
		switch (max) {
			case r:
				h = ((g - b) / d + (g < b ? 6 : 0)) / 6
				break
			case g:
				h = ((b - r) / d + 2) / 6
				break
			default:
				h = ((r - g) / d + 4) / 6
		}
	}

	return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
}

export function hslToHex(hRaw: number, sRaw: number, lRaw: number): string {
	const h = ((hRaw % 360) + 360) % 360
	const s = Math.min(100, Math.max(0, sRaw)) / 100
	const l = Math.min(100, Math.max(0, lRaw)) / 100

	const c = (1 - Math.abs(2 * l - 1)) * s
	const x = c * (1 - Math.abs(((h / 60) % 2) - 1))
	const m = l - c / 2

	let rp = 0
	let gp = 0
	let bp = 0
	if (h < 60) {
		rp = c
		gp = x
	} else if (h < 120) {
		rp = x
		gp = c
	} else if (h < 180) {
		gp = c
		bp = x
	} else if (h < 240) {
		gp = x
		bp = c
	} else if (h < 300) {
		rp = x
		bp = c
	} else {
		rp = c
		bp = x
	}

	const toHex = (n: number) =>
		Math.round(Math.min(255, Math.max(0, (n + m) * 255)))
			.toString(16)
			.padStart(2, '0')

	return `#${toHex(rp)}${toHex(gp)}${toHex(bp)}`
}
