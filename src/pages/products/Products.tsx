import { RightOutlined, LoadingOutlined } from "@ant-design/icons"
import { Breadcrumb, Flex, Space, Spin, Typography } from "antd"
import { isError } from "lodash"
import { Link } from "react-router-dom"

const Products = () => {
  return (
    <>
    <Space
    orientation="vertical"
    size={`large`}
    style={{width: "100%"}}
    >
         <Flex
    justify="space-between"
    >
      <Breadcrumb 
    separator = {<RightOutlined />}
    items={[
      {
        title: <Link to={"/"}>Dashboard</Link>
      },{
        title: "Products"
      }
    ]}
    />
        
    </Flex>
    </Space>
    </>
  )
}

export default Products