"use client"

import Link from "next/link"
import Image from "next/image"
import { MinusOutlined, PlusOutlined, DeleteOutlined } from "@ant-design/icons"
import { Button, Typography, Card, InputNumber, Divider, Empty, Row, Col, message, Spin } from "antd"
import { useAppSelector } from "@/lib/hooks/useAppSelector"
import { useAppDispatch } from "@/lib/hooks/useAppDispatch"
import { selectCartItems, removeItem, updateQuantity, clearCart } from "@/lib/store/slices/cartSlice"
import { useGetProductsQuery } from "@/lib/store/api/apiSlice"
import { selectUser } from "@/lib/store/slices/authSlice"
import { useRouter } from "next/navigation"

const { Title, Text, Paragraph } = Typography

export default function CartPage() {
  const cartItems = useAppSelector(selectCartItems)
  const user = useAppSelector(selectUser)
  const dispatch = useAppDispatch()
  const router = useRouter()
  const [messageApi, contextHolder] = message.useMessage()

  const { data: products = [], isLoading } = useGetProductsQuery()

  // Get cart items with product details
  const cartItemsWithDetails = cartItems
    .map((item) => {
      const product = products.find((p) => p.id === item.id)
      return {
        ...item,
        product,
      }
    })
    .filter((item) => item.product !== undefined)

  // Calculate subtotal
  const subtotal = cartItemsWithDetails.reduce((total, item) => {
    return total + (item.product?.price || 0) * item.quantity
  }, 0)

  const handleCheckout = () => {
    if (!user) {
      messageApi.error("Please sign in to proceed to checkout")
      router.push("/auth/signin?redirect=/checkout")
      return
    }

    router.push("/checkout")
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-12 flex justify-center">
        <Spin size="large" />
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto py-12">
        {contextHolder}
        <Title level={2} className="mb-8">
          Your Cart
        </Title>
        <div className="text-center py-12">
          <Empty description="Your cart is empty" />
          <Paragraph className="mb-8">Looks like you haven't added anything to your cart yet.</Paragraph>
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
      <Title level={2} className="mb-8">
        Your Cart
      </Title>

      <Row gutter={[32, 32]}>
        <Col xs={24} md={16}>
          <Card>
            <div className="flex justify-between items-center mb-4">
              <Title level={4}>Items ({cartItemsWithDetails.length})</Title>
              <Button onClick={() => dispatch(clearCart())}>Clear Cart</Button>
            </div>

            <Divider />

            {cartItemsWithDetails.map((item) => (
              <div key={item.id} className="mb-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-shrink-0">
                    <div className="relative h-24 w-24 bg-white rounded-md overflow-hidden">
                      <Image
                        src={item.product?.image || "/placeholder.svg"}
                        alt={item.product?.title || "Product"}
                        fill
                        className="object-contain p-2"
                      />
                    </div>
                  </div>

                  <div className="flex-1">
                    <Link href={`/products/${item.id}`} className="hover:underline">
                      <Text strong>{item.product?.title}</Text>
                    </Link>
                    <Text type="secondary" className="block mt-1 capitalize">
                      {item.product?.category}
                    </Text>
                    <div className="flex justify-between items-center mt-2">
                      <div className="flex items-center gap-2">
                        <Button
                          icon={<MinusOutlined />}
                          onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))}
                          size="small"
                        />
                        <InputNumber
                          min={1}
                          value={item.quantity}
                          onChange={(value) => dispatch(updateQuantity({ id: item.id, quantity: value || 1 }))}
                          className="w-16"
                          size="small"
                        />
                        <Button
                          icon={<PlusOutlined />}
                          onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                          size="small"
                        />
                      </div>
                      <div className="flex items-center gap-4">
                        <Text strong>${((item.product?.price || 0) * item.quantity).toFixed(2)}</Text>
                        <Button
                          type="text"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => dispatch(removeItem(item.id))}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <Divider />
              </div>
            ))}
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card>
            <Title level={4} className="mb-4">
              Order Summary
            </Title>

            <div className="space-y-3">
              <div className="flex justify-between">
                <Text type="secondary">Subtotal</Text>
                <Text>${subtotal.toFixed(2)}</Text>
              </div>
              <div className="flex justify-between">
                <Text type="secondary">Shipping</Text>
                <Text>Calculated at checkout</Text>
              </div>
              <div className="flex justify-between">
                <Text type="secondary">Tax</Text>
                <Text>Calculated at checkout</Text>
              </div>
              <Divider />
              <div className="flex justify-between">
                <Text strong>Total</Text>
                <Text strong>${subtotal.toFixed(2)}</Text>
              </div>
            </div>

            <Button type="primary" block size="large" className="mt-6" onClick={handleCheckout}>
              Proceed to Checkout
            </Button>

            <div className="mt-6 text-center">
              <Link href="/categories/all" className="text-blue-600 hover:underline">
                Continue Shopping
              </Link>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

