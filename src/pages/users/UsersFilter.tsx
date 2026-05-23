import { Card, Col, Form, Input, Row, Select } from "antd"

type UserFilterProps = {
 children: React.ReactNode
}

const UsersFilter = ({children}: UserFilterProps) => {
  return (
    <Card>
      <Row justify="space-between">
        <Col span={16}>
          <Row gutter={20}>
            <Col span={8}>
            <Form.Item name="q">
                <Input.Search placeholder="Search"  allowClear={true}/>
            </Form.Item>
            </Col>
            <Col span={8}>
            <Form.Item name="role">
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
            {/* <Col span={8}>
            <Select
            allowClear={true}
            onChange={(selectedItem) => onFilterChange("statusFilter", selectedItem)}
              style={{width: "100%"}}            
              placeholder="Status"
              options={
                [{
                value: "ban",
                label: "Banned"
              },
              {
                value: "active",
                label: "Active",
              }
            ]
            }
              >
            </Select>
            </Col> */}
          </Row>
        </Col>
        <Col span={8}
        style={{display: "flex",justifyContent: "end"}}
        >
          {children}
        </Col>
      </Row>
    </Card>
  )
}

export default UsersFilter