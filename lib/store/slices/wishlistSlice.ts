import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { RootState } from "../index"

type WishlistState = {
  items: number[]
}

const initialState: WishlistState = {
  items: [],
}

// Load wishlist from localStorage if available
if (typeof window !== "undefined") {
  const savedWishlist = localStorage.getItem("wishlist")
  if (savedWishlist) {
    try {
      initialState.items = JSON.parse(savedWishlist)
    } catch (error) {
      console.error("Failed to parse wishlist from localStorage", error)
    }
  }
}

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<number>) => {
      if (!state.items.includes(action.payload)) {
        state.items.push(action.payload)
      }

      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("wishlist", JSON.stringify(state.items))
      }
    },
    removeItem: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((id) => id !== action.payload)

      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("wishlist", JSON.stringify(state.items))
      }
    },
    clearWishlist: (state) => {
      state.items = []

      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("wishlist", JSON.stringify(state.items))
      }
    },
  },
})

// Selectors
export const selectWishlistItems = (state: RootState) => state.wishlist.items
export const selectIsInWishlist = (state: RootState, id: number) => state.wishlist.items.includes(id)

export const { addItem, removeItem, clearWishlist } = wishlistSlice.actions
export default wishlistSlice.reducer

