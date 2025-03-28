"use client"

import { Row, Col, Spin } from "antd"
import { useGetProductsQuery } from "@/lib/store/api/apiSlice"
import ProductCard from "@/components/product-card"

export default function FeaturedProducts() {
  const { data: products = [], isLoading, error } = useGetProductsQuery()

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spin size="large" />
      </div>
    )
  }

  if (error) {
    return <div className="text-center py-12">Error loading products. Please try again later.</div>
  }

  // Get top rated products (first 4)
  const featuredProducts = [...products].sort((a, b) => b.rating.rate - a.rating.rate).slice(0, 4)

  return (
    <Row gutter={[24, 24]}>
      {featuredProducts.map((product) => (
        <Col key={product.id} xs={24} sm={12} lg={6}>
          <ProductCard product={product} />
        </Col>
      ))}
    </Row>
  )
}

