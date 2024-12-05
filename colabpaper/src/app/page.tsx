import { createClient } from "@/utils/supabase/server"
import { redirect } from 'next/navigation'
import SplashPage from '@/components/Marketing/splash-page'

export default async function RootPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  console.log(user)
  // If user is authenticated, redirect to dashboard
  if (user) {
    redirect('/dashboard')
  }

  // Otherwise, show splash page
  return <SplashPage />
}