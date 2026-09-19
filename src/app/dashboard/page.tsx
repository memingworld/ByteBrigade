import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import HeroSection from '@/components/dashboard/HeroSection'
import ScoreBoard from '@/components/dashboard/ScoreBoard'

import { Suspense } from 'react'
import Loading from '../loading'

async function DashboardContent() {
	const supabase = createClient()
	const { data: { user } } = await supabase.auth.getUser()

	if (!user) {
		redirect("/login")
	}

	// Fetch user's team
	const { data: _profile } = await supabase
		.from("profiles")
		.select("team_id")
		.eq("id", user.id)
		.single()

	const { data: _roleData } = await supabase
		.from("user_roles")
		.select("role")
		.eq("user_id", user.id)
		.single()

	const profile = _profile as any;
	const role = (_roleData as any)?.role;
	
	const { data: _team } = await supabase.from("teams").select("id").limit(1).single()
  const team = _team as any;;
	// If they are core, they might not have a team_id. Default to this dashboard's team.
	const TEAM_ID = profile?.team_id || (role === 'core' ? team?.id : null);

	if (!TEAM_ID) {
		return <div className="text-red-500 font-mono text-center p-8">CRITICAL ERROR: OPERATIVE IS NOT ASSIGNED TO A TEAM.</div>
	}

	const { data: _teamProfiles } = await supabase.from('profiles').select('*').eq('team_id', TEAM_ID)
	const teamProfiles = (_teamProfiles as any[]) || []

	const { data: _roles } = await supabase.from('user_roles').select('user_id, role')
	const allRoles = (_roles as any[]) || []
	const roleMap = new Map<string, string>()
	allRoles.forEach(r => roleMap.set(r.user_id, r.role))

	// Ghost Participant filtering
	const validProfiles = teamProfiles.filter(p => {
		const r = roleMap.get(p.id)
		return r !== 'lead' && r !== 'core'
	})

	const { data: _allMemberSubmissions } = await supabase.from('submissions').select('net_points, member_id').eq('team_id', TEAM_ID).eq('status', 'verified')
	const allMemberSubmissions = (_allMemberSubmissions as any[]) || []

	let mvps: { member_id: string; full_name: string; sprint_track: string; avatar_path: string | null; total_points: number }[] = []
	const scoresMap = new Map<string, any>()

	validProfiles.forEach((p) => {
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
	
	// Calculate total team score only from valid MVPs
	const teamScore = mvps.reduce((acc, curr) => acc + curr.total_points, 0)

	const { data: recentSubmissions } = await supabase
		.from('submissions')
		.select('*, profiles(full_name), activity_catalog(label)')
		.eq('team_id', TEAM_ID)
		.eq('status', 'verified')
		.order('submitted_at', { ascending: false })
		.limit(20)

	const validRecentSubmissions = (recentSubmissions as any[] || []).filter(sub => {
		const r = roleMap.get(sub.member_id)
		return r !== 'lead' && r !== 'core'
	})

	return (
		<div className="flex-1 flex flex-col min-h-[calc(100vh-3.5rem)] pb-20">
			<HeroSection teamScore={teamScore} />
			<ScoreBoard mvps={mvps} recentActivity={validRecentSubmissions} />
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


