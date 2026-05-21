import { Card, Col, Input, Row, Select } from "antd"

type UserFilterProps = {
 onFilterChange : (filterName:string, filterValue: string) => void;
 children: React.ReactNode
}

const UsersFilter = ({onFilterChange, children}: UserFilterProps) => {
  return (
    <Card>
      <Row justify="space-between">
        <Col span={16}>
          <Row gutter={20} >
            <Col  span={8} >
                <Input.Search placeholder="Search"  allowClear={true} onChange={(e) => onFilterChange("searchFilter", e.target.value)}/>
            </Col>
            <Col span={8}>
              <Select
              allowClear={true}
              onChange={(selectedItem) => onFilterChange("roleFilter", selectedItem)}
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
            </Col>
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