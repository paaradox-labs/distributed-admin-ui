import { Card, Col, Form, Input, Row } from "antd";

type TenantFilterProps = {
    children: React.ReactNode
}

const TenantFilter = ({
    children
}: TenantFilterProps) => {
    return(
        <Card>
            <Row justify="space-between" gutter={[0, 12]}>
                <Col xs={24} lg={16}>
                    <Row gutter={[12, 0]}>
                        <Col xs={24} sm={12}>
                            <Form.Item name="q" style={{ marginBottom: 0 }}>
                                <Input.Search
                                allowClear={true}
                                placeholder="Search"
                            />
                            </Form.Item>
                        </Col>
                    </Row>
                </Col>
                <Col xs={24} lg={8} style={{ display: 'flex', justifyContent: 'end' }}>
                    {children}
                </Col>
            </Row>
        </Card>
    )
}

export default TenantFilter