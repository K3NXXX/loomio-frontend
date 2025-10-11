import { MediaPlayer, MediaProvider } from '@vidstack/react'

import '@vidstack/react/player/styles/default/theme.css'
import '@vidstack/react/player/styles/default/layouts/video.css'

export function WatchVideo({ videoSrc }: { videoSrc: string }) {
	return (
		<MediaPlayer
			src={videoSrc}
			className='vds-theme aspect-video w-full rounded-xl bg-black'
			controls
		>
			<MediaProvider />
		</MediaPlayer>
	)
}
