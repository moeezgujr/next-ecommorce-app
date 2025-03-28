import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { RootState } from "../index"

export type User = {
  id: string
  name: string
  email: string
  token?: string
}

type AuthState = {
  user: User | null
  isLoading: boolean
}

const initialState: AuthState = {
  user: null,
  isLoading: false,
}

// Load user from localStorage if available
if (typeof window !== "undefined") {
  const savedUser = localStorage.getItem("user")
  if (savedUser) {
    try {
      initialState.user = JSON.parse(savedUser)
    } catch (error) {
      console.error("Failed to parse user from localStorage", error)
    }
  }
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload

      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(action.payload))
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    logout: (state) => {
      state.user = null

      // Remove from localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("user")
      }
    },
  },
})

// Selectors
export const selectUser = (state: RootState) => state.auth.user
export const selectIsLoading = (state: RootState) => state.auth.isLoading
export const selectIsAuthenticated = (state: RootState) => !!state.auth.user

export const { setUser, setLoading, logout } = authSlice.actions
export default authSlice.reducer

