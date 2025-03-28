"use client"

import Link from "next/link"
import { Button, Typography } from "antd"

const { Title, Paragraph } = Typography

export default function HomeBanner() {
  return (
    <section className="relative rounded-lg overflow-hidden mb-12">
      <div className="bg-gradient-to-r from-blue-600 to-blue-400 h-[400px] flex items-center">
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="max-w-lg">
            <Title level={1} style={{ color: "white", marginBottom: "16px" }}>
              Summer Sale
            </Title>
            <Paragraph style={{ color: "rgba(255, 255, 255, 0.9)", fontSize: "18px", marginBottom: "24px" }}>
              Get up to 50% off on our latest collection. Limited time offer.
            </Paragraph>
            <Button type="primary" size="large" style={{ background: "white", color: "#1677ff" }}>
              <Link href="/categories/all">Shop Now</Link>
            </Button>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 bg-black/20" />
    </section>
  )
}

