"use client"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button, Form, Input, Typography, Card, Divider, message } from "antd"
import { UserOutlined, LockOutlined } from "@ant-design/icons"
import { useLoginMutation } from "@/lib/store/api/apiSlice"
import { useAppDispatch } from "@/lib/hooks/useAppDispatch"
import { setUser } from "@/lib/store/slices/authSlice"

const { Title, Text, Paragraph } = Typography

export default function SignInPage() {
  const [form] = Form.useForm()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get("redirect") || "/"
  const dispatch = useAppDispatch()
  const [messageApi, contextHolder] = message.useMessage()

  const [login, { isLoading }] = useLoginMutation()

  const handleSubmit = async (values: { email: string; password: string }) => {
    try {

      // Simulate successful login with mock data
      const mockUser = {
        id: "1",
        name: "Demo User",
        email: values.email,
        token: "mock-jwt-token",
      }

      dispatch(setUser(mockUser))
      messageApi.success("You have been signed in successfully")
      router.push(redirect)
    } catch (error) {
      messageApi.error("Invalid email or password")
    }
  }

  return (
    <div className="container mx-auto py-12">
      {contextHolder}
      <div className="max-w-md mx-auto">
        <div className="text-center mb-6">
          {/* <Title level={2}>Sign In</Title> */}
          Signin
          <Paragraph type="secondary">Enter your credentials to access your account</Paragraph>
        </div>

        <Card>
          <Form form={form} name="signin" initialValues={{ remember: true }} onFinish={handleSubmit} layout="vertical">
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Please input your email!" },
                { type: "email", message: "Please enter a valid email!" },
              ]}
            >
              <Input prefix={<UserOutlined />} placeholder="you@example.com" />
            </Form.Item>

            <Form.Item
              name="password"
              label={
                <div className="flex justify-between w-full">
                  <span>Password</span>
                  <Link href="/auth/forgot-password" className="text-blue-600 hover:underline">
                    Forgot password?
                  </Link>
                </div>
              }
              rules={[{ required: true, message: "Please input your password!" }]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="••••••••" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={isLoading} block>
                Sign In
              </Button>
            </Form.Item>
          </Form>

          <div className="text-center mt-4">
            <Text>
              Don&apos;t have an account?{" "}
              <Link href="/auth/signup" className="text-blue-600 hover:underline">
                Sign up
              </Link>
            </Text>
          </div>

          <Divider />

          <div className="text-center text-xs text-gray-500">
            <p>For demo purposes, you can use any email and password</p>
          </div>
        </Card>
      </div>
    </div>
  )
}

