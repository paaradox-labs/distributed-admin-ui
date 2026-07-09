import { Card, Col, Form, Input, Row } from "antd"

type PromosFilterProps = {
    children: React.ReactNode
}

const PromosFilter = ({ children }: PromosFilterProps) => {
    return (
        <Card>
            <Row justify="space-between">
                <Col span={16}>
                    <Row gutter={20}>
                        <Col span={12}>
                            <Form.Item name="q">
                                <Input.Search placeholder="Search" allowClear={true} />
                            </Form.Item>
                        </Col>
                    </Row>
                </Col>
                <Col span={8} style={{ display: "flex", justifyContent: "end" }}>
                    {children}
                </Col>
            </Row>
        </Card>
    )
}

export default PromosFilter
