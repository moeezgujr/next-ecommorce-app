"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, Typography, Rate } from "antd"
import type { Product } from "@/types"

const { Text } = Typography

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/products/${product.id}`}>
      <Card
        hoverable
        cover={
          <div className="relative h-64 bg-white p-4 flex items-center justify-center">
            <Image
              src={product.image || "/placeholder.svg"}
              alt={product.title}
              width={150}
              height={150}
              className="object-contain max-h-full"
            />
          </div>
        }
      >
        <div className="h-16 overflow-hidden">
          <Text strong className="line-clamp-2">
            {product.title}
          </Text>
        </div>
        <div className="flex items-center mt-2">
          <Rate allowHalf defaultValue={product.rating.rate} disabled className="text-sm" />
          <Text className="ml-2 text-sm">({product.rating.count})</Text>
        </div>
        <div className="flex justify-between items-center mt-2">
          <Text strong>${product.price.toFixed(2)}</Text>
          <Text type="secondary" className="capitalize">
            {product.category}
          </Text>
        </div>
      </Card>
    </Link>
  )
}

