import { LoadingOutlined, PlusOutlined, RightOutlined, } from "@ant-design/icons"
import { Breadcrumb, Button, Drawer, Flex, Form, Image, Space, Spin, Table, Tag, theme, Typography } from "antd"
import { Link } from "react-router-dom"
import ProductsFilter from "./ProductsFilter"
import { useQuery, keepPreviousData, useMutation, useQueryClient } from "@tanstack/react-query"
import { createProduct, getProducts } from "../../http/api"
import { useMemo, useState } from "react"
import { PER_PAGE } from "../../constants"
import type { FieldData, Product } from "../../types/types"
import { format } from "date-fns"
import { debounce } from "lodash"
import { useAuthStore } from "../../store"
import ProductForm from "./forms/ProductForm"
import { makeFormData } from "./helpers"

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

    const [form] = Form.useForm()

    const [filterForm] = Form.useForm()
    const { user } = useAuthStore()

    const [queryParams, setQueryParams] = useState({
      limit: PER_PAGE,
      page: 1,
      isPublish: false,
      tenantId: user!.role === "manager" ? user?.tenant?.id : undefined  
    })

     const { data: products, isFetching, isError, error } = useQuery({
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

    const changedFiltersField = changedFields.map((item) => ({
          [item.name[0]]: item.value
      })).reduce((acc,item) => ({...acc, ...item}),{})

      if("q" in changedFiltersField){
          debouncedQUpdate(changedFiltersField.q)
      } else{
        setQueryParams((prev) => ({
        ...prev,
        ...changedFiltersField,
        page: 1
      }))
      }
  }

  const [drawerOpen, setDrawerOpen] = useState(false)

    const { token: {colorBgLayout} } = theme.useToken()

    const queryClient = useQueryClient()


     const { mutate: productMutate } = useMutation({
        mutationKey: ["product"],
        mutationFn: async (data: FormData) => createProduct(data).then((res) => res.data),
        onSuccess: async() => {
            queryClient.invalidateQueries({
                queryKey: ["products"]
            })
            form.resetFields()
            setDrawerOpen(false)
            return
        }
    })

    const onHandleSubmit = async() => {

      const priceConfiguration = form.getFieldValue("priceConfiguration")
      
      const pricing = Object.entries(priceConfiguration).reduce((acc,[key, value]) => {
        const parsedKey = JSON.parse(key);

        return{
          ...acc,
          [parsedKey.configurationKey]: {
            priceType: parsedKey.priceType,
            availableOptions: value
          }
        }
      }, {})

      const categoryId = JSON.parse(form.getFieldValue("categoryId"))._id

      const attributes = Object.entries(form.getFieldValue("attributes")  ).map(([key, value]) => {
        return{ 
          name: key,
          value    
        }
      })
      

      const postData = {
        ...form.getFieldsValue(),
        isPublish: form.getFieldValue("isPublish") ? true : false,
        image: form.getFieldValue("image"),
        categoryId,
        priceConfiguration: pricing,
        attributes
      }
      
      await form.validateFields()

      const formData = makeFormData(postData)

      await productMutate(formData)
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
        {
      isFetching && ( <Spin 
      indicator={<LoadingOutlined 
        style={{fontSize: 24}}
        spin
      />}
      /> )
    }
    {
      isError && <Typography.Text type="danger">
        {error.message}  
      </Typography.Text>
    }
    </Flex>
    <Form form={filterForm} onFieldsChange={onFilterChange} initialValues={{ isPublish: false }}>
      <ProductsFilter>
      <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setDrawerOpen(true)}
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
      <Drawer
    title= {"Add Product"}
    styles={{body: {background: colorBgLayout}}}
    size={720} 
    destroyOnHidden={true}
    open={drawerOpen}
    onClose={()=>{
      form.resetFields()
      setDrawerOpen(false)
    }}
    extra={
      <Space>
        <Button
        onClick={() => {
          form.resetFields()
          setDrawerOpen(false)
        }}
        >
          Cancel
        </Button>
        <Button
        onClick={onHandleSubmit}
        type="primary"
        >
          Submit
        </Button>
      </Space>
    }
    >
     <Form
     layout="vertical"
     form={form}
     >
      <ProductForm />
     </Form>
    </Drawer>
    </Space>
    </>
  )
}

export default Products