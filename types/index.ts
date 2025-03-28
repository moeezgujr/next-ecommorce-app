export type Product = {
  id: number
  title: string
  price: number
  description: string
  category: string
  image: string
  rating: {
    rate: number
    count: number
  }
}

export type Category = string

export type CartItem = {
  id: number
  quantity: number
}

export type User = {
  id: string
  name: string
  email: string
  token?: string
}

