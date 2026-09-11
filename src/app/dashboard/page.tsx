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
	// Fetch all team profiles first to ensure users with 0 points are visible
	const { data: _teamProfiles } = await supabase
		.from('profiles')
		.select('*')
		.eq('team_id', TEAM_ID)
		
	const teamProfiles = (_teamProfiles as any[]) || []

	const { data: _allMemberSubmissions } = await supabase
		.from('submissions')
		.select('net_points, member_id')
		.eq('team_id', TEAM_ID)
		.eq('status', 'verified')
		
	const allMemberSubmissions = (_allMemberSubmissions as any[]) || []

	let mvps: { member_id: string; full_name: string; sprint_track: string; avatar_path: string | null; total_points: number }[] = []

	const scoresMap = new Map<string, any>()

	// Initialize everyone with 0 points
	teamProfiles.forEach((p) => {
		scoresMap.set(p.id, {
			member_id: p.id,
			full_name: p.full_name || 'UNKNOWN_OPERATIVE',
			sprint_track: p.sprint_track || 'UNASSIGNED',
			avatar_path: p.avatar_path || null,
			total_points: 0,
		})
	})

	// Add points for verified submissions
	allMemberSubmissions.forEach((sub) => {
		if (scoresMap.has(sub.member_id)) {
			scoresMap.get(sub.member_id).total_points += sub.net_points || 0
		}
	})

	mvps = Array.from(scoresMap.values()).sort((a, b) => b.total_points - a.total_points)

	const { data: recentSubmissions } = await supabase
		.from('submissions')
		.select('*, profiles(full_name), activity_catalog(label)')
		.eq('team_id', TEAM_ID)
		.eq('status', 'verified')
		.order('submitted_at', { ascending: false })
		.limit(15)

	return (
		<div className="flex-1 flex flex-col min-h-[calc(100vh-3.5rem)] pb-20">
			<HeroSection teamScore={teamScore} />
			<ScoreBoard mvps={mvps} recentActivity={(recentSubmissions as any[]) || []} />
		</div>
	)
}
