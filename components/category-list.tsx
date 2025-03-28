"use client"

import Link from "next/link"
import { Card, Row, Col, Spin } from "antd"
import { useGetCategoriesQuery } from "@/lib/store/api/apiSlice"

export default function CategoryList() {
  const { data: categories = [], isLoading, error } = useGetCategoriesQuery()

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <Spin size="large" />
      </div>
    )
  }

  if (error) {
    return <div className="text-center py-12">Error loading categories. Please try again later.</div>
  }
  return (
    <Row gutter={[16, 16]}>
      {categories.map((category) => (
        <Col key={category} xs={12} md={8} lg={6}>
          <Link href={`/categories/${category}`}>
            <Card
              hoverable
              cover={
                <div className="relative h-40 bg-gray-100 flex items-center justify-center">
                  {/* <span className="text-lg font-medium capitalize">{category}</span> */}
                </div>
              }
            >
              <Card.Meta title={category.charAt(0).toUpperCase() + category.slice(1)} />
            </Card>
          </Link>
        </Col>
      ))}
    </Row>
  )
}

