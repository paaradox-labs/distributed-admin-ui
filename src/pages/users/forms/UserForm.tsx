import { useQuery } from "@tanstack/react-query"
import { Card, Col, Form, Input, Row, Select, Space } from "antd"
import { getTenants } from "../../../http/api"
import type { Tenant } from "../../../types/types"


const UserForm = ({isEditMode = false}:{isEditMode: boolean}) => {
     const {
        data: tenants,
    } = useQuery({
        queryKey: ["tenants"],
        queryFn: () => {
            return getTenants(`perPage=100&currentPage=1`).then((res) => res.data)
        }
    })

  return (
    <Row>
        <Col span={24}>
            <Space
            orientation="vertical"
            size={`large`}
            >
            <Card
            title="Basic info"
            variant="borderless"
            >
                <Row
                gutter={20}
                >
                    <Col span={12}>
                <Form.Item
                    rules={[
                        {
                        required: true,
                        message: "First name is required"
                        },
                    ]}
                label = "First name"
                name = "firstName"
                >
                <Input placeholder="John" size="large" />
                </Form.Item>
                    </Col>
                                       <Col span={12}>
                        <Form.Item
                label = "Last name"
                name = "lastName"
                rules={[
                        {
                        required: true,
                        message: "Last name is required"
                        },
                ]}
                >
                <Input placeholder="Doe" size="large" />
                </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                label = "Email"
                name = "email"
                rules={[
                        {
                        required: true,
                        message: "Email is required"
                        },{
                            type: "email",
                            message: "Email is not valid"
                        }
                ]}
                >
                <Input placeholder="example@mail.com" size="large" autoComplete="username"/> 
                </Form.Item>
                    </Col>
                </Row>
            </Card>
            {
                !isEditMode && (
                                <Card
            title="Security info"
            variant="borderless"
            >
                <Row
                gutter={20}
                >
                    <Col span={12}>
                <Form.Item
                label = "Password"
                name = "password"
                rules={[
                    {
                        required: true,
                        message: "Password cannot be empty"
                    }
                ]}
                >
                    <Input placeholder="password" size="large" type={`password`} autoComplete="new-password" />
                </Form.Item>
                    </Col>
                </Row>
            </Card>
                )
            }
            <Card
            title="Role "
            variant="borderless"
            >
                <Row
                gutter={20}
                >
                <Col span={12}>
                <Form.Item
                label = "Role"
                name = "role"
                rules={[
                    {
                        required: true,
                        message: "Role is required"
                    }
                ]}
                >  
                        <Select
                        id="selectBoxInUserForm"
                                        size="large"
                                        style={{ width: '100%' }}
                                        allowClear={true}
                                        onChange={() => {}}
                                        placeholder="Select role"
                                        options={[
                                            {
                                                value: "admin",
                                                label: "Admin"
                                            },
                                            {
                                                value: "manager",
                                                label: "Manager"
                                            }
                                        ]}
                        
                        />
                    </Form.Item>
                </Col>
                 <Col span={12}>
                <Form.Item
                label = "Restaurant"
                name = "tenantId"
                rules={[
                    {
                        required: true,
                        message: "Restaurant is required"
                    }
                ]}
                >  
                        <Select
                        size="large"
                        style={{width: "100%"}}
                        allowClear={true}
                        onChange={() => {}}
                        placeholder={`Select restaurant`}
                        options={tenants?.data?.map((tenant: Tenant) => ({
                            value: tenant.id,
                            label: tenant.name
                        }))}
                        />
                    </Form.Item>
                </Col>
                </Row>
            </Card>
            </Space>
        </Col>
    </Row>
  )
}

export default UserForm