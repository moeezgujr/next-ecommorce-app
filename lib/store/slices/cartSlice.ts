import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { RootState } from "../index"
import type { Product } from "@/types"

export type CartItem = {
  id: number
  quantity: number
}

type CartState = {
  items: CartItem[]
}

const initialState: CartState = {
  items: [],
}

// Load cart from localStorage if available
if (typeof window !== "undefined") {
  const savedCart = localStorage.getItem("cart")
  if (savedCart) {
    try {
      initialState.items = JSON.parse(savedCart)
    } catch (error) {
      console.error("Failed to parse cart from localStorage", error)
    }
  }
}

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<number>) => {
      const existingItem = state.items.find((item) => item.id === action.payload)

      if (existingItem) {
        existingItem.quantity += 1
      } else {
        state.items.push({ id: action.payload, quantity: 1 })
      }

      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("cart", JSON.stringify(state.items))
      }
    },
    removeItem: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter((item) => item.id !== action.payload)

      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("cart", JSON.stringify(state.items))
      }
    },
    updateQuantity: (state, action: PayloadAction<{ id: number; quantity: number }>) => {
      const { id, quantity } = action.payload

      if (quantity < 1) {
        state.items = state.items.filter((item) => item.id !== id)
      } else {
        const item = state.items.find((item) => item.id === id)
        if (item) {
          item.quantity = quantity
        }
      }

      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("cart", JSON.stringify(state.items))
      }
    },
    clearCart: (state) => {
      state.items = []

      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("cart", JSON.stringify(state.items))
      }
    },
  },
})

// Selectors
export const selectCartItems = (state: RootState) => state.cart.items
export const selectCartItemCount = (state: RootState) =>
  state.cart.items.reduce((total, item) => total + item.quantity, 0)
export const selectCartSubtotal = (state: RootState, products: Product[]) =>
  state.cart.items.reduce((total, item) => {
    const product = products.find((p) => p.id === item.id)
    return total + (product?.price || 0) * item.quantity
  }, 0)

export const { addItem, removeItem, updateQuantity, clearCart } = cartSlice.actions
export default cartSlice.reducer

