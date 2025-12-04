import { create } from 'zustand'
import { supabase } from '../lib/supabase'

export const useAuthStore = create((set, get) => ({
  user: null,
  loading: true,

  // Cek sesi saat aplikasi dibuka
  checkUser: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      set({ user: session?.user || null, loading: false })
    } catch (error) {
      set({ loading: false })
    }
  },

  // Register Manual
  registerWithEmail: async (email, password, fullName) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName }
      }
    })
    if (error) throw error
    if (data.user) set({ user: data.user })
    return data
  },

  // Login Manual
  loginWithEmail: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
    set({ user: data.user })
    return data
  },

  // Logout
  logout: async () => {
    await supabase.auth.signOut()
    set({ user: null })
  },

  // Update Profile
  updateProfile: async (updates) => {
    const { user } = get()
    if (!user) throw new Error("No user logged in")

    // 1. Update data di tabel public.profiles
    const { error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)

    if (error) throw error

    // 2. Update state user lokal (metadata)
    const { data: { user: updatedUser }, error: userError } = await supabase.auth.updateUser({
      data: { 
        full_name: updates.full_name, 
        avatar_url: updates.avatar_url,
        website: updates.website
      }
    })

    if (userError) throw userError
    set({ user: updatedUser })
  }
}))