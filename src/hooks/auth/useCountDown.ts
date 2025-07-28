import { useEffect, useState } from 'react'

export const useCountdown = (expiresAt: Date | undefined) => {
	const [timeLeft, setTimeLeft] = useState(0)

	useEffect(() => {
		if (!expiresAt) return
		const updateTimer = () => {
			const diff = new Date(expiresAt).getTime() - Date.now()
			setTimeLeft(Math.max(0, diff))
		}
		updateTimer()
		const interval = setInterval(updateTimer, 1000)
		return () => clearInterval(interval)
	}, [expiresAt])

	return {timeLeft}
}
