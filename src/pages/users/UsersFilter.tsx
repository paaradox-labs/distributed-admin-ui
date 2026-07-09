import { Card, Col, Form, Input, Row, Select } from "antd"

type UserFilterProps = {
 children: React.ReactNode
}

const UsersFilter = ({children}: UserFilterProps) => {
  return (
    <Card>
      <Row justify="space-between" gutter={[0, 12]}>
        <Col xs={24} lg={16}>
          <Row gutter={[12, 12]}>
            <Col xs={24} sm={12} lg={8}>
            <Form.Item name="q" style={{ marginBottom: 0 }}>
                <Input.Search placeholder="Search"  allowClear={true}/>
            </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={8}>
            <Form.Item name="role" style={{ marginBottom: 0 }}>
              <Select
              allowClear={true}
              style={{width: "100%"}}
              placeholder="Select role"
              options={
                [{
                value: "admin",
                label: "Admin"
              },
              {
                value: "manager",
                label: "Manager",
              },{
                value: "customer",
                label: "Customer"
              }
            ]
            }
              >
            </Select>
            </Form.Item>
            </Col>
          </Row>
        </Col>
        <Col xs={24} lg={8}
        style={{display: "flex", justifyContent: "end"}}
        >
          {children}
        </Col>
      </Row>
    </Card>
  )
}

export default UsersFilter