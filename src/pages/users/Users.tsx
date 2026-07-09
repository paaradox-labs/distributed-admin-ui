 
import { LoadingOutlined, PlusOutlined, RightOutlined } from "@ant-design/icons"
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Link, Navigate } from "react-router-dom"
import { createUser, getUsers, updateUser } from "../../http/api"
import { Breadcrumb, Button, Descriptions, Drawer, Flex, Form, Grid, Space, Spin, Table, theme, Typography } from "antd"
import type { CreateUserData, FieldData, User } from "../../types/types"
import { useAuthStore } from "../../store"
import UsersFilter from "./UsersFilter"
import { useEffect, useMemo, useState } from "react"
import UserForm from "./forms/UserForm"
import { PER_PAGE } from "../../constants"
import { debounce } from "lodash"

const Users = () => {

  const [form] = Form.useForm()
  const [filterForm] = Form.useForm()

  const [currentEditingUser, setCurrentEditingUser] = useState<User | null>(null)

  const queryClient = useQueryClient()

  const { token: {colorBgLayout} } = theme.useToken()
  const screens = Grid.useBreakpoint()
  const isMobile = !screens.md

  const [queryParams, setQueryParams] = useState({
    perPage: PER_PAGE,
    currentPage: 1
  })

  const [drawerOpen, setDrawerOper] = useState(false)

  const { data: users, isFetching, isError, error } = useQuery({
    queryKey: ["users", queryParams],
    queryFn: () =>  {
      const filteredParams = Object.fromEntries(Object.entries(queryParams).filter(item => !!item[1]))
      const queryString = new URLSearchParams(filteredParams as unknown as Record<string, string>).toString()
      return getUsers(queryString).then((res) => res.data)
    },
    placeholderData: keepPreviousData
  })

  const { user } = useAuthStore()

  const {mutate: userMutate} = useMutation({
    mutationKey: ["user"],
    mutationFn: async(data: CreateUserData) => createUser(data).then((res) => res.data),
    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: ["users"]
      })
      return;
    }
  })

    const {mutate: updateUserMutation} = useMutation({
    mutationKey: ["update-user"],
    mutationFn: async(data: CreateUserData) => updateUser(data, currentEditingUser!.id).then((res) => res.data),
    onSuccess: async () => {
      queryClient.invalidateQueries({
        queryKey: ["users"]
      })
      return;
    }
  })

  const onHandleSubmit = async () => {
    await form.validateFields()
    const isEditMode = !!currentEditingUser
  
    if(isEditMode){
      await updateUserMutation(form.getFieldsValue())
    }else{
      await userMutate(form.getFieldsValue())
    }
    form.resetFields()
    setCurrentEditingUser(null)
    setDrawerOper(false)
  }

  const debouncedQUpdate = useMemo(() => {
    return debounce((value: string | undefined) => {
      setQueryParams((prev) => ({...prev, q: value, currentPage: 1}))
    }, 500)
  },[])

  useEffect(() => {
    return() => {
      debouncedQUpdate.cancel()
    }
  },[debouncedQUpdate])

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
        currentPage: 1
      }))
      }
  }

  if(user?.role !== "admin"){
    return <Navigate to={`/`} replace={true} />
  }

  const columns = [
    ...(isMobile ? [] : [{
      title: "ID",
      dataIndex: "id",
      key: "id",
    }]),
    {
      title: "Name",
      dataIndex: "firstName",
      key: "firstName",
      render: (_text:string, record: User ) => {
          return <div>{record.firstName} {record.lastName}</div>
      }
    },
    ...(isMobile ? [] : [{
      title: "Email",
      dataIndex: "email",
      key: "email"
    }]),
    {
      title: "Role",
      dataIndex: "role",
      key: "role"
    },
    ...(isMobile ? [] : [{
      title: "Restaurant",
      dataIndex: "tenant",
      key: "tenant",
      render: (_text: string, record: User) => {
        return <span>{record?.tenant?.name || "-"}</span>
      }
    }]),
    {
      title: "Actions",
      render: (_text: string, record: User) => {
        return(
          <Button
            onClick={() => {
              setCurrentEditingUser(record)
              form.setFieldsValue({...record, tenantId: record.tenant?.id })
              setDrawerOper(true)
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
  style={{width: "100%"}}
  size={`large`}
  >

    <Flex justify="space-between" align="center" wrap="wrap">
      <Breadcrumb
        separator={<RightOutlined />}
        items={[
          { title: <Link to={"/"}>Dashboard</Link> },
          { title: "Users" },
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

    <Form form={filterForm} onFieldsChange={onFilterChange}>
      <UsersFilter>
      <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setDrawerOper(true)}
          >
            Add User
          </Button>
    </UsersFilter>
    </Form>
    
    <Table
    columns={columns}
    dataSource={users?.data}
    rowKey={"id"}
    expandable={isMobile ? {
      expandedRowRender: (record: User) => (
        <Descriptions size="small" column={1} bordered>
          <Descriptions.Item label="ID">{record.id}</Descriptions.Item>
          <Descriptions.Item label="Email">{record.email}</Descriptions.Item>
          <Descriptions.Item label="Restaurant">{record?.tenant?.name || "-"}</Descriptions.Item>
        </Descriptions>
      ),
      rowExpandable: () => true,
    } : undefined}
    pagination={{
      total: users?.total,
      pageSize: queryParams.perPage,
      current: queryParams.currentPage,
      onChange: (page) => {
        setQueryParams((prev) => {
          return {
            ...prev,
            currentPage: page,
          }
        })
      },
      showTotal: (total: number, range: number[]) => {
        return `Showing ${range[0]}-${range[1]} of ${total} items`
      }
    }}
    />

    <Drawer
    title= {currentEditingUser ? "Edit User" : "Add User"}
    styles={{body: {background: colorBgLayout}}}
    width={Math.min(720, window.innerWidth - 48)}
    destroyOnHidden={true}
    open={drawerOpen}
    onClose={()=>{
      form.resetFields()
      setCurrentEditingUser(null)
      setDrawerOper(false)
    }}
    extra={
      <Space>
        <Button
        onClick={() => {
          form.resetFields()
          setDrawerOper(false)
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
      <UserForm isEditMode={!!currentEditingUser} />
     </Form>
    </Drawer>
  </Space>
  </>
  )
}

export default Users