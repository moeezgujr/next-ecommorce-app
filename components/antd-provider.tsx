"use client"

import type React from "react"

import { App } from "antd"

export default function AntdProvider({ children }: { children: React.ReactNode }) {
  return <App>{children}</App>
}

