import { PlusOutlined, RightOutlined, } from "@ant-design/icons"
import { Breadcrumb, Button, Flex, Form, Image, Space, Table, Tag, Typography } from "antd"
import { Link } from "react-router-dom"
import ProductsFilter from "./ProductsFilter"
import { useQuery, keepPreviousData } from "@tanstack/react-query"
import { getProducts } from "../../http/api"
import { useMemo, useState } from "react"
import { PER_PAGE } from "../../constants"
import type { FieldData, Product } from "../../types/types"
import { format } from "date-fns"
import { debounce } from "lodash"

const columns = [
  {
    title: "Product Name",
    dataIndex: "name",
    key: "name",
    render: (_:string, record: Product) => {
        return(
          <div>
             <Space>
                <Image 
                width={60}
                src={record.image}
                />
                <Typography.Text>
                  {record.name}
                </Typography.Text>
             </Space>
          </div>
        )
    }
  },
  {
    title: "Description",
    dataIndex: "description",
    key: "description"
  },{
    title: "Status",
    dataIndex: "isPublished",
    key: "isPublished",
    render: (_: boolean, record: Product) => {
      return <>
        {record.isPublish ? <Tag
        color={`green`}
        variant="outlined"
        >
          Published
        </Tag> : <Tag
        color={`red`}
        variant="outlined"
        >
          Draft
        </Tag> }
      </>
    }
  },{
    title: "CreatedAt",
    dataIndex: "createdAt",
    key: "createdAt",
    render: (text:string) => {
      return (
        <Typography.Text>
          {format(new Date(text), "dd/MM/yyyy hh:mm a" )}
        </Typography.Text>
      )
    }
  }
]


const Products = () => {

    const [filterForm] = Form.useForm()

    const [queryParams, setQueryParams] = useState({
      limit: PER_PAGE,
      page: 1,
      isPublish: true
    })

     const { data: products } = useQuery({
    queryKey: ["products", queryParams],
    queryFn: () =>  {
      const filteredParams = Object.fromEntries(Object.entries(queryParams).filter(item => !!item[1]))
      const queryString = new URLSearchParams(filteredParams as unknown as Record<string, string>).toString()
      return getProducts(queryString).then((res) => res.data)
    },
    placeholderData: keepPreviousData
  })

    const debouncedQUpdate = useMemo(() => {
      return debounce((value: string | undefined) => {
        setQueryParams((prev) => ({...prev, q: value, page: 1}))
      }, 500)
    },[])

  const onFilterChange = (changedFields: FieldData[]) => {

    const changedFiltersFields = changedFields.map((item) => ({
          [item.name[0]]: item.value
      })).reduce((acc,item) => ({...acc, ...item}),{})

      if("q" in changedFiltersFields){
          debouncedQUpdate(changedFiltersFields.q)
      } else{
        setQueryParams((prev) => ({
        ...prev,
        ...changedFiltersFields,
        page: 1
      }))
      }
  }

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
    <Form form={filterForm} onFieldsChange={onFilterChange} initialValues={{ isPublish: true }}>
      <ProductsFilter>
      <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {}}
          >
            Add Products 
          </Button>
    </ProductsFilter>
    </Form>
     <Table 
    columns={[...columns,
      {
    title: "Actions",
    render: () => {
      return(
        <Space>
          <Button
          onClick={() => {}}
          type="link"
          >
            Edit
          </Button>
        </Space>
      )
    }
  }
    ]} 
    dataSource={products?.data} 
    rowKey={"_id"} 
    pagination={{
      total: products?.total,
      pageSize: queryParams.limit,
      current: queryParams.page,
      onChange: (page) => {
        setQueryParams((prev) => {
          return {
            ...prev,
            page,
          }
        })
      },
      showTotal: (total: number, range: number[]) => {
        return `Showing ${range[0]}-${range[1]} of ${total} items`
      }
    }}
    />
    </Space>
    </>
  )
}

export default Products