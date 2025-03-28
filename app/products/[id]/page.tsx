"use client"

import type React from "react"

import Link from "next/link"
import Image from "next/image"
import { useState } from "react"
import { ShoppingCartOutlined, HeartOutlined, HeartFilled } from "@ant-design/icons"
import { Button, Typography, Rate, Input, Row, Col, Divider, message, Spin, Card } from "antd"
import { useGetProductQuery, useGetProductsByCategoryQuery } from "@/lib/store/api/apiSlice"
import { useAppDispatch } from "@/lib/hooks/useAppDispatch"
import { useAppSelector } from "@/lib/hooks/useAppSelector"
import { addItem as addToCart } from "@/lib/store/slices/cartSlice"
import {
  addItem as addToWishlist,
  removeItem as removeFromWishlist,
  selectIsInWishlist,
} from "@/lib/store/slices/wishlistSlice"
import { selectUser } from "@/lib/store/slices/authSlice"
import ProductCard from "@/components/product-card"

const { Title, Text, Paragraph } = Typography
const { TextArea } = Input

export default function ProductPage({ params }: { params: { id: string } }) {
  const productId = Number(params.id)
  const dispatch = useAppDispatch()
  const user = useAppSelector(selectUser)
  const isInWishlist = useAppSelector((state) => selectIsInWishlist(state, productId))

  const [reviewText, setReviewText] = useState("")
  const [reviewRating, setReviewRating] = useState(5)
  const [messageApi, contextHolder] = message.useMessage()

  const { data: product, isLoading, error } = useGetProductQuery(productId)

  // Get related products (same category)
  const { data: relatedProducts = [] } = useGetProductsByCategoryQuery(product?.category || "", { skip: !product })

  if (isLoading) {
    return (
      <div className="container mx-auto py-12 flex justify-center">
        <Spin size="large" />
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="container mx-auto py-12 text-center">
        <Title level={3}>Product not found</Title>
        <Button type="primary" className="mt-4">
          <Link href="/categories/all">Back to Products</Link>
        </Button>
      </div>
    )
  }

  const handleAddToCart = () => {
    dispatch(addToCart(productId))
    messageApi.success(`${product.title} has been added to your cart.`)
  }

  const handleToggleWishlist = () => {
    if (isInWishlist) {
      dispatch(removeFromWishlist(productId))
      messageApi.success(`${product.title} has been removed from your wishlist.`)
    } else {
      dispatch(addToWishlist(productId))
      messageApi.success(`${product.title} has been added to your wishlist.`)
    }
  }

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      messageApi.error("Please sign in to submit a review")
      return
    }

    // In a real app, this would send the review to the server
    messageApi.success("Thank you for your feedback!")
    setReviewText("")
  }

  // Filter out the current product from related products
  const filteredRelatedProducts = relatedProducts
    .filter((relatedProduct) => relatedProduct.id !== productId)
    .slice(0, 4)

  return (
    <main className="container mx-auto py-8">
      {contextHolder}
      <Row gutter={[32, 32]}>
        <Col xs={24} md={12}>
          <div className="bg-white p-8 rounded-lg flex items-center justify-center h-[400px] md:h-[500px]">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.title}
              width={300}
              height={300}
              className="object-contain max-h-full"
            />
          </div>
        </Col>

        <Col xs={24} md={12}>
          {product.title}
          <div className="flex items-center gap-4 mb-4">
            <Text type="secondary" className="capitalize">
              {product.category}
            </Text>
            <div className="flex items-center">
              <Rate allowHalf defaultValue={product.rating.rate} disabled />
              <Text type="secondary" className="ml-2">
                ({product.rating.count} {product.rating.count === 1 ? "review" : "reviews"})
              </Text>
            </div>
          </div>
          <Title level={3} className="mb-6">
            ${product.price.toFixed(2)}
          </Title>

          <Paragraph className="mb-8 text-gray-600">{product.description}</Paragraph>

          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <Button type="primary" size="large" icon={<ShoppingCartOutlined />} onClick={handleAddToCart} block>
              Add to Cart
            </Button>
            <Button
              size="large"
              type={isInWishlist ? "primary" : "default"}
              icon={isInWishlist ? <HeartFilled /> : <HeartOutlined />}
              onClick={handleToggleWishlist}
              block
            >
              {isInWishlist ? "In Wishlist" : "Add to Wishlist"}
            </Button>
          </div>
        </Col>
      </Row>

      {/* Reviews Section */}
      <Divider />
      <section className="mb-12">
        <Title level={3} className="mb-6">
          Customer Reviews
        </Title>

        <Row gutter={[32, 32]}>
          <Col xs={24} md={12}>
            {product.rating.count > 0 ? (
              <div className="space-y-6">
                <div className="border-b pb-6">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <Text strong>Average Rating</Text>
                      <div>
                        <Rate allowHalf defaultValue={product.rating.rate} disabled />
                        <Text className="ml-2">({product.rating.rate} out of 5)</Text>
                      </div>
                    </div>
                    <Text type="secondary">Based on {product.rating.count} reviews</Text>
                  </div>
                </div>
              </div>
            ) : (
              <Paragraph className="text-gray-600">No reviews yet. Be the first to review this product!</Paragraph>
            )}
          </Col>

          <Col xs={24} md={12}>
            <Title level={4} className="mb-4">
              Write a Review
            </Title>
            {user ? (
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div className="space-y-2">
                  <Text>Rating</Text>
                  <Rate value={reviewRating} onChange={setReviewRating} />
                </div>
                <div className="space-y-2">
                  <Text>Your Review</Text>
                  <TextArea
                    placeholder="Share your thoughts about this product..."
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    rows={4}
                    required
                  />
                </div>
                <Button type="primary" htmlType="submit">
                  Submit Review
                </Button>
              </form>
            ) : (
              <Card>
                <Paragraph className="mb-4">Please sign in to leave a review.</Paragraph>
                <Button type="primary">
                  <Link href="/auth/signin">Sign In</Link>
                </Button>
              </Card>
            )}
          </Col>
        </Row>
      </section>

      {/* Related Products */}
      {filteredRelatedProducts.length > 0 && (
        <section>
          <Title level={3} className="mb-6">
            Related Products
          </Title>
          <Row gutter={[24, 24]}>
            {filteredRelatedProducts.map((product) => (
              <Col key={product.id} xs={24} sm={12} lg={6}>
                <ProductCard product={product} />
              </Col>
            ))}
          </Row>
        </section>
      )}
    </main>
  )
}

