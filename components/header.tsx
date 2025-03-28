"use client"

import Link from "next/link"
import { useState } from "react"
import { ShoppingCartOutlined, HeartOutlined, UserOutlined, MenuOutlined } from "@ant-design/icons"
import { Button, Badge, Drawer, Menu } from "antd"
import { useAppSelector } from "@/lib/hooks/useAppSelector"
import { selectCartItemCount } from "@/lib/store/slices/cartSlice"
import { selectUser, logout } from "@/lib/store/slices/authSlice"
import { useAppDispatch } from "@/lib/hooks/useAppDispatch"
import { useGetCategoriesQuery } from "@/lib/store/api/apiSlice"

export default function Header() {
  const itemCount = useAppSelector(selectCartItemCount)
  const user = useAppSelector(selectUser)
  const dispatch = useAppDispatch()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const { data: categories = [], isLoading } = useGetCategoriesQuery()

  const handleLogout = () => {
    dispatch(logout())
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6 md:gap-10">
          <Link href="/" className="font-bold text-xl">
            E-Commerce
          </Link>

          <nav className="hidden md:flex gap-6">
            {!isLoading &&
              categories.map((category) => (
                <Link
                  key={category}
                  href={`/categories/${category}`}
                  className="text-sm font-medium transition-colors hover:text-blue-600"
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Link>
              ))}
            <Link href="/categories/all" className="text-sm font-medium transition-colors hover:text-blue-600">
              All Products
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <Link href="/wishlist">
            <Button type="text" icon={<HeartOutlined />} />
          </Link>

          <Link href="/cart">
            <Badge count={itemCount} size="small">
              <Button type="text" icon={<ShoppingCartOutlined />} />
            </Badge>
          </Link>

          {user ? (
            <div className="flex items-center gap-2">
              <Link href="/account">
                <Button type="text" icon={<UserOutlined />} />
              </Link>
              <Button type="link" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          ) : (
            <Link href="/auth/signin">
              <Button type="link">Sign In</Button>
            </Link>
          )}

          <Button type="text" icon={<MenuOutlined />} className="md:hidden" onClick={() => setIsMenuOpen(true)} />
        </div>
      </div>

      {/* Mobile menu */}
      <Drawer title="Menu" placement="right" onClose={() => setIsMenuOpen(false)} open={isMenuOpen} width={280}>
        <Menu mode="vertical">
          {!isLoading &&
            categories.map((category) => (
              <Menu.Item key={category}>
                <Link href={`/categories/${category}`} onClick={() => setIsMenuOpen(false)}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </Link>
              </Menu.Item>
            ))}
          <Menu.Item key="all">
            <Link href="/categories/all" onClick={() => setIsMenuOpen(false)}>
              All Products
            </Link>
          </Menu.Item>
        </Menu>
      </Drawer>
    </header>
  )
}

