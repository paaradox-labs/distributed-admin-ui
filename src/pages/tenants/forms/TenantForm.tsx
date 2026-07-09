import { Card, Col, Form, Input, Row } from "antd"


const TenantForm = () => {
  return (
    <Row>
        <Col span={24}>
            <Card title="Basic info" variant="borderless" style={{width: "100%"}} >
                <Row gutter={[20, 12]}>
                    <Col xs={24} sm={12}>
                        <Form.Item
                        label = "Name"
                        name = "name"
                        rules={[
                        {
                            required: true,
                            message: "Name is required"
                        }
                        ]}
                        >
                    <Input placeholder="Taj Restaurant" size="large" />
                    </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                        <Form.Item
                        label="Address"
                        name="address"
                        rules={[
                            {
                                required: true,
                                message: "Address is required"
                            }
                        ]}
                        >
                            <Input placeholder="Address" size="large" /> 
                        </Form.Item>
                    </Col>
                </Row>
            </Card>
        </Col>
    </Row>
  )
}

export default TenantForm