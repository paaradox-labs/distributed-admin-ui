import { Card, Col, Form, Input, Row, Select, Space, Switch, Typography } from "antd"


type ProductsFilterProps = {
    children?: React.ReactNode
}

const ProductsFilter = ({children}: ProductsFilterProps) => {
  return <Card>
    <Row justify={"space-between"}>
        <Col span={16}>
            <Row gutter={20}>
            <Col span={6}>
            <Form.Item name="q">
                <Input.Search placeholder="Search"  allowClear={true}/>
            </Form.Item>
            </Col>
            <Col span={6}>
            <Form.Item name="role">
              <Select
              allowClear={true}
              style={{width: "100%"}}
              placeholder="Select category"
              options={
                [{
                value: "pizza",
                label: "Pizza"
              },
              {
                value: "beverages",
                label: "Beverages",
              }
            ]
            }
              >
            </Select>
            </Form.Item>
            </Col>
            <Col span={6}>
            <Form.Item name="role">
              <Select
              allowClear={true}
              style={{width: "100%"}}
              placeholder="Select restaurant"
              options={
                [{
                value: "hub",
                label: "Pizza Hub"
              },
              {
                value: "corner",
                label: "Softy Corner",
              }
            ]
            }
              >
            </Select>
            </Form.Item>
            </Col>
        <Col span={6}
        >
            <Space>
<Switch  defaultChecked onChange={() => {}} />
                <Typography.Text>
                    Show only published
                </Typography.Text>
            </Space>
        </Col>
          </Row>
        </Col>
         <Col span={8} style={{display: "flex", justifyContent: "end"}}>
            {children}
        </Col>
    </Row>
  </Card>
}

export default ProductsFilter