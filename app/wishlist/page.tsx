"use client"

import Link from "next/link"
import Image from "next/image"
import { ShoppingCartOutlined, DeleteOutlined } from "@ant-design/icons"
import { Button, Typography, Card, Row, Col, Empty, message, Spin } from "antd"
import { useAppSelector } from "@/lib/hooks/useAppSelector"
import { useAppDispatch } from "@/lib/hooks/useAppDispatch"
import { selectWishlistItems, removeItem, clearWishlist } from "@/lib/store/slices/wishlistSlice"
import { addItem as addToCart } from "@/lib/store/slices/cartSlice"
import { useGetProductsQuery } from "@/lib/store/api/apiSlice"

const { Title, Text } = Typography

export default function WishlistPage() {
  const wishlistItems = useAppSelector(selectWishlistItems)
  const dispatch = useAppDispatch()
  const [messageApi, contextHolder] = message.useMessage()

  const { data: products = [], isLoading } = useGetProductsQuery()

  // Get wishlist items with product details
  const wishlistItemsWithDetails = wishlistItems
    .map((id) => products.find((p) => p.id === id))
    .filter((product): product is (typeof products)[0] => product !== undefined)

  const handleAddToCart = (productId: number, productTitle: string) => {
    dispatch(addToCart(productId))
    messageApi.success(`${productTitle} has been added to your cart.`)
  }

  const handleRemoveFromWishlist = (productId: number, productTitle: string) => {
    dispatch(removeItem(productId))
    messageApi.success(`${productTitle} has been removed from your wishlist.`)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-12 flex justify-center">
        <Spin size="large" />
      </div>
    )
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="container mx-auto py-12">
        {contextHolder}
        {/* <Title level={2} className="mb-8"> */}
          Your Wishlist
        {/* </Title> */}
        <div className="text-center py-12">
          <Empty description="Your wishlist is empty" />
          <Text className="block mb-8">Save items you like for later.</Text>
          <Button type="primary" size="large">
            <Link href="/categories/all">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-12">
      {contextHolder}
      <div className="flex justify-between items-center mb-8">
      Your Wishlist
        <Button onClick={() => dispatch(clearWishlist())}>Clear Wishlist</Button>
      </div>

      <Row gutter={[24, 24]}>
        {wishlistItemsWithDetails.map((product) => (
          <Col key={product.id} xs={24} sm={12} lg={6}>
            <Card
              cover={
                <div className="relative">
                  <Link href={`/products/${product.id}`}>
                    <div className="relative h-64 bg-white p-4 flex items-center justify-center">
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.title}
                        width={150}
                        height={150}
                        className="object-contain max-h-full"
                      />
                    </div>
                  </Link>
                  <Button
                    type="text"
                    icon={<DeleteOutlined />}
                    className="absolute top-2 right-2 bg-white/80 hover:bg-white/90 text-red-500"
                    onClick={() => handleRemoveFromWishlist(product.id, product.title)}
                  />
                </div>
              }
              actions={[
                <Button
                  key="add-to-cart"
                  type="primary"
                  icon={<ShoppingCartOutlined />}
                  block
                  onClick={() => handleAddToCart(product.id, product.title)}
                >
                  Add to Cart
                </Button>,
              ]}
            >
              <Link href={`/products/${product.id}`}>
                <Card.Meta
                  title={<div className="line-clamp-1">{product.title}</div>}
                  description={
                    <div className="flex justify-between items-center mt-2">
                      <Text strong>${product.price.toFixed(2)}</Text>
                      <Text type="secondary" className="capitalize">
                        {product.category}
                      </Text>
                    </div>
                  }
                />
              </Link>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  )
}

