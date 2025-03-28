import Link from "next/link"
import { ArrowRightOutlined } from "@ant-design/icons"
import { Button, Typography, Spin } from "antd"
import HomeBanner from "@/components/home-banner"
import { Suspense } from "react"
import FeaturedProducts from "@/components/featured-products"
import CategoryList from "@/components/category-list"

const { Title } = Typography

export default function Home() {
  return (
    <main className="container mx-auto py-8">
      {/* Banner Section */}
      <HomeBanner />

      {/* Categories Section */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          {/* <Title level={2}>Categories</Title> */}
          Categories
          <Button type="link">
            <Link href="/categories/all" className="flex items-center gap-2">
              View All <ArrowRightOutlined />
            </Link>
          </Button>
        </div>
        <Suspense
          fallback={
            <div className="flex justify-center py-12">
              <Spin size="large" />
            </div>
          }
        >
          <CategoryList />
        </Suspense>
      </section>

      {/* Featured Products Section */}
      <section>
        <div className="flex justify-between items-center mb-6">
          {/* <Title level={2}>Featured Products</Title> */}
          Featured Products
          <Button type="link">
            <Link href="/categories/all" className="flex items-center gap-2">
              View All <ArrowRightOutlined />
            </Link>
          </Button>
        </div>
        <Suspense
          fallback={
            <div className="flex justify-center py-12">
              <Spin size="large" />
            </div>
          }
        >
          <FeaturedProducts />
        </Suspense>
      </section>
    </main>
  )
}

