import { PlusOutlined } from "@ant-design/icons"
import { Button, Card, Col, Input, Row, Select } from "antd"

const UsersFilter = () => {
  return (
    <Card>
      <Row justify="space-between">
        <Col span={16}>
          <Row gutter={20} >
            <Col  span={8} >
                <Input.Search placeholder="Search"  allowClear={true}/>
            </Col>
            <Col span={8}>
              <Select
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
            </Col>
            <Col span={8}>
            <Select
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
            </Col>
          </Row>
        </Col>
        <Col span={8}
        style={{display: "flex",justifyContent: "end"}}
        >
          <Button
          type="primary"
          icon={<PlusOutlined />}
          >
            Add User
          </Button>
        </Col>
      </Row>
    </Card>
  )
}

export default UsersFilter