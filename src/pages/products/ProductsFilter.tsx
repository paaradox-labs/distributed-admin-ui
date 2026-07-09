import { useQuery } from "@tanstack/react-query"
import { Card, Col, Form, Input, Row, Select, Space, Switch, Typography } from "antd"
import { getCategories, getTenants } from "../../http/api"
import type { Category, Tenant } from "../../types/types"
import { useAuthStore } from "../../store"


type ProductsFilterProps = {
    children?: React.ReactNode
}

const ProductsFilter = ({children}: ProductsFilterProps) => {
  const { user } = useAuthStore()
  const {data: restaurants} = useQuery({
    queryFn: () => {
      return getTenants(`perPage=100&currentPage=1`)
    },
    queryKey: ["restaurants"],
  })

  const {data: categories} = useQuery({
    queryFn: () => {
      return getCategories()
    },
    queryKey: ["categories"], 
  })

  return <Card>
    <Row justify={"space-between"} gutter={[0, 12]}>
        <Col xs={24} lg={16}>
            <Row gutter={[12, 12]}>
            <Col xs={24} sm={12} lg={6}>
            <Form.Item name="q" style={{ marginBottom: 0 }}>
                <Input.Search placeholder="Search"  allowClear={true}/>
            </Form.Item>
            </Col>
            <Col xs={24} sm={12} lg={6}>
            <Form.Item name="categoryId" style={{ marginBottom: 0 }}>
              <Select 
              allowClear={true}
              style={{width: "100%"}}
              placeholder="Select category"
              options={categories?.data.map((category: Category) => ({
                value: category._id,
                label: category.name
              }))}
              />
            </Form.Item>
            </Col>
            
            {
              user?.role === "admin" && (
            <Col xs={24} sm={12} lg={6}>
            <Form.Item name="tenantId" style={{ marginBottom: 0 }}>
              <Select
              allowClear={true}
              style={{width: "100%"}}
              placeholder="Select restaurant"
               options={restaurants?.data.data.map((restaurant: Tenant) => ({
                value: restaurant.id,
                label: restaurant.name
              }))}
              />
            </Form.Item>
            </Col>
              ) 
            }
           
        <Col xs={24} sm={12} lg={6}>
            <Form.Item name={`isPublish`} valuePropName="checked" style={{ marginBottom: 0 }}>
                <Space>
                  <Switch defaultChecked={false}  onChange={() => {}} />
                    <Typography.Text>
                        Show only published
                    </Typography.Text>
                </Space>
            </Form.Item>
        </Col>
          </Row>
        </Col>
         <Col xs={24} lg={8} style={{ display: "flex", justifyContent: "end" }}>
            {children}
        </Col>
    </Row>
  </Card>
}

export default ProductsFilter