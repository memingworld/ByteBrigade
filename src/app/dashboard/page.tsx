import { createClient } from '@/lib/supabase/server'
import HeroSection from '@/components/dashboard/HeroSection'
import ScoreBoard from '@/components/dashboard/ScoreBoard'

import { Suspense } from 'react'
import Loading from '../loading'

async function DashboardContent() {
	const supabase = createClient()

	const TEAM_ID = 'f876de5d-4ada-4e24-bc97-bba3408d82f2'

	const { data: teamSubmissions } = await supabase.from('submissions').select('net_points').eq('team_id', TEAM_ID).eq('status', 'verified')
	const teamScore = (teamSubmissions as any[])?.reduce((acc, curr) => acc + (curr.net_points || 0), 0) || 0

	const { data: _teamProfiles } = await supabase.from('profiles').select('*').eq('team_id', TEAM_ID)
	const teamProfiles = (_teamProfiles as any[]) || []

	const { data: _allMemberSubmissions } = await supabase.from('submissions').select('net_points, member_id').eq('team_id', TEAM_ID).eq('status', 'verified')
	const allMemberSubmissions = (_allMemberSubmissions as any[]) || []

	let mvps: { member_id: string; full_name: string; sprint_track: string; avatar_path: string | null; total_points: number }[] = []
	const scoresMap = new Map<string, any>()

	teamProfiles.forEach((p) => {
		scoresMap.set(p.id, {
			member_id: p.id,
			full_name: p.full_name || 'UNKNOWN_OPERATIVE',
			sprint_track: p.sprint_track || 'UNASSIGNED',
			avatar_path: p.avatar_path || null,
			total_points: 0,
		})
	})

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

export default function DashboardPage() {
	return (
		<Suspense fallback={<Loading />}>
			<DashboardContent />
		</Suspense>
	)
}
