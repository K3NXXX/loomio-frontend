export const getCloudinarySources = (publicId: string) => {
	const base = 'https://res.cloudinary.com/drsdieji1/video/upload'

	return [
		{
			src: `${base}/q_auto,vc_auto,f_mp4,w_1280,h_720,c_scale/${publicId}.mp4`,
			type: 'video/mp4',
			size: 720,
		},
		{
			src: `${base}/q_auto,vc_auto,f_mp4,w_854,h_480,c_scale/${publicId}.mp4`,
			type: 'video/mp4',
			size: 480,
		},
		{
			src: `${base}/q_auto,vc_auto,f_mp4,w_640,h_360,c_scale/${publicId}.mp4`,
			type: 'video/mp4',
			size: 360,
		},
	]
}
