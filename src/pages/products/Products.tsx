import { LoadingOutlined, PlusOutlined, RightOutlined, } from "@ant-design/icons"
import { Breadcrumb, Button, Descriptions, Drawer, Flex, Form, Image, Space, Spin, Table, Tag, theme, Typography, Grid } from "antd"
import { Link } from "react-router-dom"
import ProductsFilter from "./ProductsFilter"
import { useQuery, keepPreviousData, useMutation, useQueryClient } from "@tanstack/react-query"
import { createProduct, getProducts, updateProduct } from "../../http/api"
import { useEffect, useMemo, useState } from "react"
import { PER_PAGE } from "../../constants"
import type { FieldData, Product } from "../../types/types"
import { format } from "date-fns"
import { debounce } from "lodash"
import { useAuthStore } from "../../store"
import ProductForm from "./forms/ProductForm"
import { makeFormData } from "./helpers"


const Products = () => {

    const [drawerOpen, setDrawerOpen] = useState(false)
    const [form] = Form.useForm()
    const [selectedProduct, setCurrentProduct] = useState<Product | null>(null)

    const screens = Grid.useBreakpoint()
    const isMobile = !screens.md

    useEffect(() => {
      if(selectedProduct){
        const priceConfiguration  = Object.entries(selectedProduct.priceConfiguration).reduce((acc, [key, value]) => {
          const stringifiedKey = JSON.stringify({
            configurationKey: key,
            priceType: value.priceType
          })
          return {
            ...acc,
            [stringifiedKey]: value.availableOptions,
          }
        },
        {})

        const attributes = selectedProduct.attributes.reduce((acc, item) => {
          return{
            ...acc,
            [item.name]: item.value
          }
        },{})

        form.setFieldsValue({
          ...selectedProduct,
          priceConfiguration,
          attributes,
          // todo : fix this
          categoryId: selectedProduct.category._id
        })
      }
    }, [selectedProduct, form])



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


    const { token: {colorBgLayout} } = theme.useToken()

    const queryClient = useQueryClient()


     const { mutate: productMutate, isPending: isCreatingLoading} = useMutation({
        mutationKey: ["product"],
        mutationFn: async (data: FormData) => {
          if(selectedProduct){
            // edit mode 
            return updateProduct(data, selectedProduct._id).then(res => res.data)
          } else {
            // create mode
            return createProduct(data).then((res) => res.data)
          }
        },
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

      const categoryId = form.getFieldValue("categoryId")

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
        tenantId: user?.role  === "manager" ? user.tenant?.id : form.getFieldValue("tenantId"),
        priceConfiguration: pricing,
        attributes
      }
      
      await form.validateFields()

      const formData = makeFormData(postData)

      await productMutate(formData)
    }

    const columns = [
      {
        title: "Product Name",
        dataIndex: "name",
        key: "name",
        render: (_:string, record: Product) => {
            return(
              <Space>
                {!isMobile && <Image width={60} src={record.image} />}
                <Typography.Text>{record.name}</Typography.Text>
              </Space>
            )
        }
      },
      ...(isMobile ? [] : [{
        title: "Description",
        dataIndex: "description",
        key: "description",
        render: (text: string) => (
          <div style={{ wordBreak: "break-word" }}>{text}</div>
        ),
      }]),
      {
        title: "Status",
        dataIndex: "isPublished",
        key: "isPublished",
        render: (_: boolean, record: Product) => {
          return <>
            {record.isPublish ? <Tag color={`green`} variant="outlined">Published</Tag> : <Tag color={`red`} variant="outlined">Draft</Tag> }
          </>
        }
      },
      ...(isMobile ? [] : [{
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
      }]),
      {
        title: "Actions",
        render: (_: unknown, record: Product) => {
          return(
            <Button
              onClick={() => {
                setCurrentProduct(record) 
                setDrawerOpen(true)
              }}
              type="link"
            >
              Edit
            </Button>
          )
        }
      }
    ]

  return (
    <>
    <Space
    orientation="vertical"
    size={`large`}
    style={{width: "100%"}}
    >
         <Flex justify="space-between" align="center" wrap="wrap">
      <Breadcrumb
        separator={<RightOutlined />}
        items={[
          { title: <Link to={"/"}>Dashboard</Link> },
          { title: "Products" },
        ]}
      />
      <Space>
        {isFetching && (
          <Spin indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />} />
        )}
        {isError && (
          <Typography.Text type="danger">{error.message}</Typography.Text>
        )}
      </Space>
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
    columns={columns}
    dataSource={products?.data}
    rowKey={"_id"}
    size={isMobile ? "small" : "middle"}
    expandable={isMobile ? {
      expandedRowRender: (record: Product) => (
        <Descriptions size="small" column={1} bordered>
          <Descriptions.Item label="Image"><Image width={80} src={record.image} /></Descriptions.Item>
          <Descriptions.Item label="Description">{record.description}</Descriptions.Item>
          <Descriptions.Item label="CreatedAt">{format(new Date(record.createdAt), "dd/MM/yyyy hh:mm a")}</Descriptions.Item>
        </Descriptions>
      ),
      rowExpandable: () => true,
    } : undefined}
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
    title= {selectedProduct ? "Edit Product" : "Add Product"}
    styles={{body: {background: colorBgLayout}}}
    width={Math.min(720, window.innerWidth - 48)} 
    destroyOnHidden={true}
    open={drawerOpen}
    onClose={()=>{
      setCurrentProduct(null)
      form.resetFields()
      setDrawerOpen(false)
    }}
    extra={
      <Space>
        <Button
        onClick={() => {
          setCurrentProduct(null)
          form.resetFields()
          setDrawerOpen(false)
        }}
        >
          Cancel
        </Button>
        <Button
        loading={isCreatingLoading}
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
      <ProductForm form={form} />
     </Form>
    </Drawer>
    </Space>
    </>
  )
}

export default Products