import { useQuery } from "@tanstack/react-query"
import { Card, Col, Form, Input, Row, Select, Space, Switch, Typography } from "antd"
import { getCategories, getTenants } from "../../http/api"
import type { Category, Tenant } from "../../types/types"


type ProductsFilterProps = {
    children?: React.ReactNode
}

const ProductsFilter = ({children}: ProductsFilterProps) => {

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
    <Row justify={"space-between"}>
        <Col span={16}>
            <Row gutter={20}>
            <Col span={6}>
            <Form.Item name="q">
                <Input.Search placeholder="Search"  allowClear={true}/>
            </Form.Item>
            </Col>
            <Col span={6}>
            <Form.Item name="category">
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
            <Col span={6}>
            <Form.Item name="restaurant">
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