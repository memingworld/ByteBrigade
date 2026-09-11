import { createClient } from '@/lib/supabase/server'
import HeroSection from '@/components/dashboard/HeroSection'
import ScoreBoard from '@/components/dashboard/ScoreBoard'

export default async function DashboardPage() {
	const supabase = createClient()

	// Byte Brigade Team ID for filtering (in a real app, query by slug or user profile)
	const TEAM_ID = 'f876de5d-4ada-4e24-bc97-bba3408d82f2'

	// 1. Get Team Score (sum of all net_points where status = verified)
	const { data: teamSubmissions, error: teamError } = await supabase.from('submissions').select('net_points').eq('team_id', TEAM_ID).eq('status', 'verified')

	const teamScore = (teamSubmissions as any[])?.reduce((acc, curr) => acc + (curr.net_points || 0), 0) || 0

	// 2. Get MVP Scoreboard
	// We need to join profiles and submissions, then aggregate.
	// Since Supabase RPC is better for grouping, we will simulate it with a standard query and JS map for this implementation
	const { data: allMemberSubmissions, error: mvpError } = await supabase
		.from('submissions')
		.select('net_points, member_id, profiles(full_name, sprint_track)')
		.eq('team_id', TEAM_ID)
		.eq('status', 'verified')

	let mvps: { member_id: string; full_name: string; sprint_track: string; total_points: number }[] = []

	if (allMemberSubmissions) {
		const scoresMap = new Map<string, any>();

		(allMemberSubmissions as any[]).forEach((sub) => {
			const p = sub.profiles as any
			if (!scoresMap.has(sub.member_id)) {
				scoresMap.set(sub.member_id, {
					member_id: sub.member_id,
					full_name: p?.full_name || 'Unknown Operative',
					sprint_track: p?.sprint_track || 'Unassigned',
					total_points: 0,
				})
			}
			scoresMap.get(sub.member_id).total_points += sub.net_points || 0
		})

		mvps = Array.from(scoresMap.values()).sort((a, b) => b.total_points - a.total_points)
	}

	return (
		<div className="flex-1 flex flex-col min-h-[calc(100vh-3.5rem)] pb-20">
			<HeroSection teamScore={teamScore} />
			<ScoreBoard mvps={mvps} />
		</div>
	)
}
