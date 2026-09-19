'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function login(formData: FormData) {
	const supabase = createClient()

	const email = formData.get('email') as string
	const password = formData.get('password') as string

	const { error } = await supabase.auth.signInWithPassword({
		email,
		password,
	})

	if (error) {
		return redirect('/login?message=Could not authenticate user')
	}

	return redirect('/dashboard')
}

export async function signup(formData: FormData) {
	const supabase = createClient()

	// Registration Toggle Check via Secure RPC
	const { data: registrationStatus } = await supabase.rpc('get_registration_status')

	if (registrationStatus === 'CLOSED') {
		return redirect('/signup?message=REGISTRATION CLOSED. TEAM CAPACITY (9/9) REACHED.')
	}

	const email = formData.get('email') as string
	const password = formData.get('password') as string
	const fullName = formData.get('fullName') as string
	const department = formData.get('department') as string
	const sprintTrack = formData.get('sprintTrack') as string
	const enrollmentNo = formData.get('enrollmentNo') as string

	// Strict Validation
	if (!email || !password || !fullName || !department || !sprintTrack || !enrollmentNo) {
		return redirect('/signup?message=All fields are strictly required.')
	}

	if (!/^\d+$/.test(enrollmentNo)) {
		return redirect('/signup?message=INVALID_INPUT: Enrollment number must contain only numerical digits.')
	}

	const validDepartments = ['Technical', 'Event Management', 'R&D', 'Social', 'Design', 'PR']
	if (!validDepartments.includes(department)) {
		return redirect('/signup?message=INVALID_INPUT: Unauthorized department selected.')
	}

	const validTracks = ['code', 'open_source', 'build', 'pitch']
	if (!validTracks.includes(sprintTrack)) {
		return redirect('/signup?message=INVALID_INPUT: Unauthorized sprint track selected.')
	}

	// 1. Create the user in Auth
	const { data: authData, error: authError } = await supabase.auth.signUp({
		email,
		password,
	})

	if (authError) {
		return redirect('/signup?message=' + authError.message)
	}

	const userId = authData.user?.id

	if (userId) {
		const { data: _team } = await supabase.from('teams').select('id').limit(1).single()
		const team = _team as any

		// 2. Create the user profile
		const { error: profileError } = await supabase.from('profiles').insert({
			id: userId,
			full_name: fullName,
			department: department,
			enrollment_no: enrollmentNo,
			team_id: team?.id || null, // Default to primary team
			sprint_track: sprintTrack,
			is_active: true,
		} as any)

		if (profileError) {
			console.error('Profile Error:', profileError)
			return redirect('/signup?message=Profile creation failed: ' + profileError.message)
		}
	}

	return redirect('/dashboard')
}

export async function logout() {
	const supabase = createClient()
	await supabase.auth.signOut()
	return redirect('/login')
}
