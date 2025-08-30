import { useState, useEffect } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'

export interface UserProfile {
  id: string
  user_id: string
  display_name?: string
  role: 'doctor' | 'nurse' | 'admin' | 'staff'
  department?: string
  created_at: string
  updated_at: string
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', userId)
        .single()

      if (error) throw error
      setProfile(data as UserProfile)
    } catch (err) {
      console.error('Error fetching profile:', err)
      setProfile(null)
    }
  }

  const signUp = async (email: string, password: string, displayName?: string, role?: string) => {
    try {
      const redirectUrl = `${window.location.origin}/`
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            display_name: displayName,
            role: role || 'doctor'
          }
        }
      })

      if (error) throw error

      toast({
        title: "Account Created",
        description: "Please check your email to verify your account",
        variant: "default"
      })

      return { data, error: null }
    } catch (err: any) {
      console.error('Sign up error:', err)
      toast({
        title: "Sign Up Failed",
        description: err.message || "Unable to create account",
        variant: "destructive"
      })
      return { data: null, error: err }
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      toast({
        title: "Welcome Back",
        description: "Successfully signed in",
        variant: "default"
      })

      return { data, error: null }
    } catch (err: any) {
      console.error('Sign in error:', err)
      toast({
        title: "Sign In Failed",
        description: err.message || "Invalid credentials",
        variant: "destructive"
      })
      return { data: null, error: err }
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      setUser(null)
      setSession(null)
      setProfile(null)

      toast({
        title: "Signed Out",
        description: "You have been successfully signed out",
        variant: "default"
      })
    } catch (err: any) {
      console.error('Sign out error:', err)
      toast({
        title: "Sign Out Failed",
        description: err.message || "Unable to sign out",
        variant: "destructive"
      })
    }
  }

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          // Fetch user profile when authenticated
          setTimeout(() => {
            fetchProfile(session.user.id)
          }, 0)
        } else {
          setProfile(null)
        }
        
        setLoading(false)
      }
    )

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      
      if (session?.user) {
        fetchProfile(session.user.id)
      }
      
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  return {
    user,
    session,
    profile,
    loading,
    signUp,
    signIn,
    signOut,
    fetchProfile
  }
}