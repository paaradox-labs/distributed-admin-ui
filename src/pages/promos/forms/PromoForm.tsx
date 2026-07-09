import { Card, Col, DatePicker, Form, Input, InputNumber, Row, Select } from "antd"
import { useQuery } from "@tanstack/react-query"
import { getTenants } from "../../../http/api"
import type { Tenant } from "../../../types/types"
import { useAuthStore } from "../../../store"

const PromoForm = () => {
    const { user } = useAuthStore()

    const { data: tenants } = useQuery({
        queryKey: ["tenants"],
        queryFn: () => {
            return getTenants(`perPage=100&currentPage=1`).then((res) => res.data)
        },
    })

    return (
        <Row>
            <Col span={24}>
                <Card title="Coupon info" variant="borderless">
                    <Row gutter={[20, 12]}>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                label="Title"
                                name="title"
                                rules={[{ required: true, message: "Title is required" }]}
                            >
                                <Input placeholder="Summer Sale" size="large" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                label="Code"
                                name="code"
                                rules={[{ required: true, message: "Code is required" }]}
                            >
                                <Input placeholder="SUMMER20" size="large" />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                label="Discount (%)"
                                name="discount"
                                rules={[{ required: true, message: "Discount is required" }]}
                            >
                                <InputNumber
                                    min={0}
                                    max={100}
                                    size="large"
                                    style={{ width: "100%" }}
                                    placeholder="20"
                                    formatter={(value) => `${value}%`}
                                />
                            </Form.Item>
                        </Col>
                        <Col xs={24} sm={12}>
                            <Form.Item
                                label="Valid Upto"
                                name="validUpto"
                                rules={[{ required: true, message: "Validity is required" }]}
                            >
                                <DatePicker
                                    showTime={{ format: "h:mm A" }}
                                    format="YYYY-MM-DD h:mm A"
                                    placeholder="Select valid upto date & time"
                                    size="large"
                                    style={{ width: "100%" }}
                                />
                            </Form.Item>
                        </Col>
                        {user?.role !== "manager" && (
                            <Col xs={24} sm={12}>
                                <Form.Item
                                    label="Restaurant"
                                    name="tenantId"
                                    rules={[{ required: true, message: "Restaurant is required" }]}
                                >
                                    <Select
                                        size="large"
                                        style={{ width: "100%" }}
                                        allowClear={true}
                                        placeholder="Select restaurant"
                                        options={tenants?.data?.map((tenant: Tenant) => ({
                                            value: tenant.id,
                                            label: tenant.name,
                                        }))}
                                    />
                                </Form.Item>
                            </Col>
                        )}
                    </Row>
                </Card>
            </Col>
        </Row>
    )
}

export default PromoForm
