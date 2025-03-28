"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { CreditCardOutlined } from "@ant-design/icons"
import { Button, Form, Input, Radio, Steps, Typography, Card, Divider, Row, Col, Result, message } from "antd"
import { useCart } from "@/lib/context/cart-context"
import { useAuth } from "@/lib/context/auth-context"
import { products } from "@/lib/data"

const { Title, Text } = Typography

// Steps in checkout process
const STEPS = {
  SHIPPING: 0,
  PAYMENT: 1,
  REVIEW: 2,
  CONFIRMATION: 3,
}

export default function CheckoutPage() {
  const [step, setStep] = useState(STEPS.SHIPPING)
  const [shippingInfo, setShippingInfo] = useState({
    fullName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "United States",
    phone: "",
  })
  const [paymentMethod, setPaymentMethod] = useState("credit-card")
  const [isProcessing, setIsProcessing] = useState(false)

  const { items, subtotal, clearCart } = useCart()
  const { user } = useAuth()
  const router = useRouter()
  const [messageApi, contextHolder] = message.useMessage()

  // Calculate shipping, tax, and total
  const shipping = 10
  const tax = subtotal * 0.08
  const total = subtotal + shipping + tax

  // Get cart items with product details
  const cartItems = items
    .map((item) => {
      const product = products.find((p) => p.id === item.id)
      return {
        ...item,
        product,
      }
    })
    .filter((item) => item.product !== undefined)

  // Handle form submission for each step
  const handleShippingSubmit = (values: any) => {
    setShippingInfo(values)
    setStep(STEPS.PAYMENT)
  }

  const handlePaymentSubmit = (values: any) => {
    setPaymentMethod(values.paymentMethod)
    setStep(STEPS.REVIEW)
  }

  const handlePlaceOrder = async () => {
    setIsProcessing(true)

    // Simulate order processing
    setTimeout(() => {
      clearCart()
      setStep(STEPS.CONFIRMATION)
      setIsProcessing(false)
    }, 2000)
  }

  // Redirect if not logged in or cart is empty
  if (!user) {
    router.push("/auth/signin?redirect=/checkout")
    return null
  }

  if (cartItems.length === 0 && step !== STEPS.CONFIRMATION) {
    router.push("/cart")
    return null
  }

  // Render confirmation step
  if (step === STEPS.CONFIRMATION) {
    return (
      <div className="container mx-auto py-12 max-w-3xl">
        {contextHolder}
        <Result
          status="success"
          title="Order Confirmed!"
          subTitle={`Thank you for your purchase. A confirmation email has been sent to ${user.email}.`}
          extra={[
            <Button type="primary" key="console" onClick={() => router.push("/")}>
              Continue Shopping
            </Button>,
          ]}
        />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-12">
      {contextHolder}
      <Title level={2} className="mb-8">
        Checkout
      </Title>

      {/* Checkout Steps */}
      <div className="max-w-3xl mx-auto mb-8">
        <Steps current={step} items={[{ title: "Shipping" }, { title: "Payment" }, { title: "Review" }]} />
      </div>

      <Row gutter={[32, 32]}>
        <Col xs={24} md={16}>
          {/* Shipping Information */}
          {step === STEPS.SHIPPING && (
            <Card>
              <Title level={4} className="mb-4">
                Shipping Information
              </Title>
              <Form layout="vertical" initialValues={shippingInfo} onFinish={handleShippingSubmit}>
                <Form.Item
                  name="fullName"
                  label="Full Name"
                  rules={[{ required: true, message: "Please enter your full name" }]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  name="address"
                  label="Address"
                  rules={[{ required: true, message: "Please enter your address" }]}
                >
                  <Input />
                </Form.Item>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item name="city" label="City" rules={[{ required: true, message: "Please enter your city" }]}>
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="state"
                      label="State"
                      rules={[{ required: true, message: "Please enter your state" }]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      name="zipCode"
                      label="Zip Code"
                      rules={[{ required: true, message: "Please enter your zip code" }]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      name="country"
                      label="Country"
                      rules={[{ required: true, message: "Please enter your country" }]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  name="phone"
                  label="Phone Number"
                  rules={[{ required: true, message: "Please enter your phone number" }]}
                >
                  <Input />
                </Form.Item>

                <Form.Item>
                  <Button type="primary" htmlType="submit" block>
                    Continue to Payment
                  </Button>
                </Form.Item>
              </Form>
            </Card>
          )}

          {/* Payment Information */}
          {step === STEPS.PAYMENT && (
            <Card>
              <Title level={4} className="mb-4">
                Payment Method
              </Title>
              <Form layout="vertical" initialValues={{ paymentMethod }} onFinish={handlePaymentSubmit}>
                <Form.Item name="paymentMethod">
                  <Radio.Group className="w-full">
                    <div className="space-y-4">
                      <Card className="w-full">
                        <Radio value="credit-card" className="flex items-center">
                          <div className="flex items-center gap-2">
                            <CreditCardOutlined />
                            <span>Credit / Debit Card</span>
                          </div>
                        </Radio>
                      </Card>
                      <Card className="w-full">
                        <Radio value="paypal" className="flex items-center">
                          <span>PayPal</span>
                        </Radio>
                      </Card>
                    </div>
                  </Radio.Group>
                </Form.Item>

                {paymentMethod === "credit-card" && (
                  <div className="space-y-4 pt-4">
                    <Form.Item
                      name="cardNumber"
                      label="Card Number"
                      rules={[{ required: true, message: "Please enter your card number" }]}
                    >
                      <Input placeholder="1234 5678 9012 3456" />
                    </Form.Item>

                    <Row gutter={16}>
                      <Col span={12}>
                        <Form.Item
                          name="expiry"
                          label="Expiry Date"
                          rules={[{ required: true, message: "Please enter expiry date" }]}
                        >
                          <Input placeholder="MM/YY" />
                        </Form.Item>
                      </Col>
                      <Col span={12}>
                        <Form.Item name="cvc" label="CVC" rules={[{ required: true, message: "Please enter CVC" }]}>
                          <Input placeholder="123" />
                        </Form.Item>
                      </Col>
                    </Row>

                    <Form.Item
                      name="nameOnCard"
                      label="Name on Card"
                      rules={[{ required: true, message: "Please enter name on card" }]}
                    >
                      <Input />
                    </Form.Item>
                  </div>
                )}

                <Form.Item>
                  <div className="flex gap-4">
                    <Button onClick={() => setStep(STEPS.SHIPPING)}>Back</Button>
                    <Button type="primary" htmlType="submit" block>
                      Continue to Review
                    </Button>
                  </div>
                </Form.Item>
              </Form>
            </Card>
          )}

          {/* Order Review */}
          {step === STEPS.REVIEW && (
            <Card>
              <Title level={4} className="mb-4">
                Review Your Order
              </Title>

              <div className="space-y-6">
                <div>
                  <Text strong className="block mb-2">
                    Shipping Information
                  </Text>
                  <div className="text-gray-600">
                    <p>{shippingInfo.fullName}</p>
                    <p>{shippingInfo.address}</p>
                    <p>
                      {shippingInfo.city}, {shippingInfo.state} {shippingInfo.zipCode}
                    </p>
                    <p>{shippingInfo.country}</p>
                    <p>{shippingInfo.phone}</p>
                  </div>
                </div>

                <Divider />

                <div>
                  <Text strong className="block mb-2">
                    Payment Method
                  </Text>
                  <div className="text-gray-600 flex items-center gap-2">
                    {paymentMethod === "credit-card" ? (
                      <>
                        <CreditCardOutlined />
                        <span>Credit / Debit Card</span>
                      </>
                    ) : (
                      <span>PayPal</span>
                    )}
                  </div>
                </div>

                <Divider />

                <div>
                  <Text strong className="block mb-2">
                    Order Items
                  </Text>
                  <ul className="space-y-4">
                    {cartItems.map((item) => (
                      <li key={item.id} className="flex justify-between">
                        <div>
                          <Text>{item.product?.title}</Text>
                          <Text type="secondary"> × {item.quantity}</Text>
                        </div>
                        <Text>${((item.product?.price || 0) * item.quantity).toFixed(2)}</Text>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex gap-4 pt-6">
                <Button onClick={() => setStep(STEPS.PAYMENT)}>Back</Button>
                <Button type="primary" block onClick={handlePlaceOrder} loading={isProcessing}>
                  {isProcessing ? "Processing..." : "Place Order"}
                </Button>
              </div>
            </Card>
          )}
        </Col>

        <Col xs={24} md={8}>
          <Card className="sticky top-20">
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
                <Text>${shipping.toFixed(2)}</Text>
              </div>
              <div className="flex justify-between">
                <Text type="secondary">Tax</Text>
                <Text>${tax.toFixed(2)}</Text>
              </div>
              <Divider />
              <div className="flex justify-between">
                <Text strong>Total</Text>
                <Text strong>${total.toFixed(2)}</Text>
              </div>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

