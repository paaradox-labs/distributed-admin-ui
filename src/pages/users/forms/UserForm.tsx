import { useQuery } from "@tanstack/react-query"
import { Card, Col, Form, Input, Row, Select, Space } from "antd"
import { getTenants } from "../../../http/api"
import type { Tenant } from "../../../types/types"


const UserForm = () => {

     const {
        data: tenants,
    } = useQuery({
        queryKey: ["tenants"],
        queryFn: () => {
            return getTenants().then((res) => res.data)
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
                >
                <Input placeholder="Doe" size="large" />
                </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item
                label = "Email"
                name = "email"
                >
                <Input placeholder="example@mail.com" size="large" /> 
                </Form.Item>
                    </Col>
                </Row>
            </Card>
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
                >
                    <Input placeholder="password" size="large" type={`password`} />
                </Form.Item>
                    </Col>
                </Row>
            </Card>
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
                >  
                        <Select
                        size="large"
                        style={{width: "100%"}}
                        allowClear={true}
                        onChange={() => {}}
                        placeholder={`Select role`}
                        options={tenants?.map((tenant: Tenant) => ({
                            value: tenant.id,
                            label: tenant.name
                        }))}
                        />
                    </Form.Item>
                </Col>
                 <Col span={12}>
                <Form.Item
                label = "Restaurant"
                name = "tenantId"
                >  
                        <Select
                        size="large"
                        style={{width: "100%"}}
                        allowClear={true}
                        onChange={() => {}}
                        placeholder={`Select restaurant`}
                        options={tenants?.map((tenant: Tenant) => ({
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