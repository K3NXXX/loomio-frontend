'use client'

export function Dashboard() {
	return (
		<div className='p-10 flex flex-col items-start'>
			<h1 className='text-[25px] font-bold mb-8 tracking-tight text-left w-full'>
				Channel management panel
			</h1>

			<div className='flex flex-col md:flex-row gap-10 w-full'>
				<div className='w-[420px] h-[320px] rounded-2xl border border-border/40 transition-all flex flex-col items-center justify-center text-center p-6 hover:shadow-md'>
					<h2 className='text-xl font-semibold mb-2'>Add videos</h2>
					<p className='text-muted-foreground text-sm mb-6 max-w-[260px]'>
						Start growing your channel by uploading your first video. You can
						track its performance here once it’s published.
					</p>
				</div>

				<div className='flex-1 min-w-[280px] max-w-[400px] rounded-2xl border border-border/40 bg-background/60 p-6 shadow-sm hover:shadow-md transition-all'>
					<div className='flex flex-col gap-3'>
						<div className='flex items-center justify-between px-5 py-3 rounded-lg border border-border/40 bg-muted/10'>
							<p className='text-sm text-muted-foreground tracking-wide'>
								Videos
							</p>
						</div>
						<div className='flex items-center justify-between px-5 py-3 rounded-lg border border-border/40 bg-muted/10'>
							<p className='text-sm text-muted-foreground tracking-wide'>
								Followers
							</p>
						</div>
						<div className='flex items-center justify-between px-5 py-3 rounded-lg border border-border/40 bg-muted/10'>
							<p className='text-sm text-muted-foreground tracking-wide'>
								Total views
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
