"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, Spin, Empty, Pagination, Typography, Row, Col } from "antd"
import { useGetProductsQuery, useGetProductsByCategoryQuery } from "@/lib/store/api/apiSlice"
import ProductCard from "@/components/product-card"

const { Title, Text } = Typography

export default function CategoryPage({
  params,
}: {
  params: { category: string }
}) {
  // State for pagination and sorting
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(8)
  const [sortOption, setSortOption] = useState("newest")

  // Fetch products based on category
  const isAllProducts = params.category === "all"
  const { data: allProducts = [], isLoading: isLoadingAll } = useGetProductsQuery(undefined, {
    skip: !isAllProducts,
  })
  const { data: categoryProducts = [], isLoading: isLoadingCategory } = useGetProductsByCategoryQuery(params.category, {
    skip: isAllProducts,
  })

  const isLoading = isAllProducts ? isLoadingAll : isLoadingCategory
  const products = isAllProducts ? allProducts : categoryProducts

  // Sort products
  const sortedProducts = [...products]

  switch (sortOption) {
    case "price-low":
      sortedProducts.sort((a, b) => a.price - b.price)
      break
    case "price-high":
      sortedProducts.sort((a, b) => b.price - a.price)
      break
    case "name":
      sortedProducts.sort((a, b) => a.title.localeCompare(b.title))
      break
    case "rating":
      sortedProducts.sort((a, b) => b.rating.rate - a.rating.rate)
      break
    default: // newest (by id as proxy)
      sortedProducts.sort((a, b) => b.id - a.id)
  }

  // Paginate
  const totalProducts = sortedProducts.length
  const paginatedProducts = sortedProducts.slice((page - 1) * pageSize, page * pageSize)

  // Reset page when category changes
  useEffect(() => {
    setPage(1)
  }, [params.category])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center">
        <Spin size="large" />
      </div>
    )
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8">
      {params.category === "all"
            ? "All Products"
            : params.category.charAt(0).toUpperCase() + params.category.slice(1)}
        {/* <Title level={2}>
          
        </Title> */}
        <Text type="secondary">{totalProducts} products found</Text>
      </div>

      {/* Sorting and Filtering */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Sort by:</span>
          <Select
            defaultValue={sortOption}
            style={{ width: 180 }}
            onChange={(value) => setSortOption(value)}
            options={[
              { value: "newest", label: "Newest" },
              { value: "price-low", label: "Price: Low to High" },
              { value: "price-high", label: "Price: High to Low" },
              { value: "name", label: "Name" },
              { value: "rating", label: "Rating" },
            ]}
          />
        </div>
      </div>

      {/* Products Grid */}
      {paginatedProducts.length > 0 ? (
        <Row gutter={[24, 24]} className="mb-8">
          {paginatedProducts.map((product) => (
            <Col key={product.id} xs={24} sm={12} md={8} lg={6}>
              <ProductCard product={product} />
            </Col>
          ))}
        </Row>
      ) : (
        <div className="text-center py-12">
          <Empty description="No products found" />
          <Button asChild className="mt-4">
            <Link href="/categories/all">View All Products</Link>
          </Button>
        </div>
      )}

      {/* Pagination */}
      {totalProducts > pageSize && (
        <div className="flex justify-center mt-8">
          <Pagination
            current={page}
            pageSize={pageSize}
            total={totalProducts}
            onChange={(page) => setPage(page)}
            showSizeChanger
            onShowSizeChange={(current, size) => {
              setPage(1)
              setPageSize(size)
            }}
          />
        </div>
      )}
    </main>
  )
}

