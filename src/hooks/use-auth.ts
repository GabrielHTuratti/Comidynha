"use client"

import { useState, useEffect, useCallback } from "react"
import { getProfile } from "@/services/v1"
import type { IUser } from "@/model/users"

interface AuthState {
  user: IUser | null
  isLoading: boolean
  error: string | null
}
let globalAuthState: AuthState = {
  user: null,
  isLoading: true,
  error: null,
}

const authListeners: Set<(state: AuthState) => void> = new Set()

const notifyListeners = (newState: AuthState) => {
  globalAuthState = newState
  authListeners.forEach((listener) => listener(newState))
}

const fetchUserProfile = async () => {
  try {
    notifyListeners({ ...globalAuthState, isLoading: true, error: null })

    const profile = await getProfile()

    notifyListeners({
      user: profile,
      isLoading: false,
      error: null,
    })

    return profile
  } catch (error) {
    console.log("Erro ao buscar perfil:", error)

    notifyListeners({
      user: null,
      isLoading: false,
      error: error instanceof Error ? error.message : "Erro desconhecido",
    })

    return null
  }
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>(globalAuthState)

  useEffect(() => {
    authListeners.add(setAuthState)

    if (globalAuthState.isLoading && !globalAuthState.user) {
      fetchUserProfile()
    }

    return () => {
      authListeners.delete(setAuthState)
    }
  }, [])

  const refreshUser = useCallback(async () => {
    return await fetchUserProfile()
  }, [])

  const clearUser = useCallback(() => {
    notifyListeners({
      user: null,
      isLoading: false,
      error: null,
    })
  }, [])

  const setUser = useCallback((user: IUser) => {
    notifyListeners({
      user,
      isLoading: false,
      error: null,
    })
  }, [])

  return {
    user: authState.user,
    isLoading: authState.isLoading,
    error: authState.error,
    refreshUser,
    clearUser,
    setUser,
  }
}

export const updateAuthState = {
  setUser: (user: IUser) => {
    notifyListeners({
      user,
      isLoading: false,
      error: null,
    })
  },
  clearUser: () => {
    notifyListeners({
      user: null,
      isLoading: false,
      error: null,
    })
  },
  refresh: fetchUserProfile,
}
