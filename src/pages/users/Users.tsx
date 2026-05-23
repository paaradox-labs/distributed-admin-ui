import { LoadingOutlined, PlusOutlined, RightOutlined } from "@ant-design/icons"
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Link, Navigate } from "react-router-dom"
import { createUser, getUsers } from "../../http/api"
import { Breadcrumb, Button, Drawer, Flex, Form, Space, Spin, Table, theme, Typography } from "antd"
import type { CreateUserData, FieldData, User } from "../../types/types"
import { useAuthStore } from "../../store"
import UsersFilter from "./UsersFilter"
import { useState } from "react"
import UserForm from "./forms/UserForm"
import { PER_PAGE } from "../../constants"

const columns = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "Name",
    dataIndex: "firstName",
    key: "firstName",
    render: (_text:string, record: User ) => {
        return(
            <div>
              {record.firstName} {record.lastName}
            </div>
        )
    }
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email"
  },{
    title: "Role",
    dataIndex: "role",
    key: "role" 
  },{
    title: "Restaurant Name",
    dataIndex: "tenant",
    key: "tenant",
    render: (_text: string, record: User) => {
      return <span>
        {record?.tenant?.name || "-"} 
      </span>
    }
  }
]

const Users = () => {

  const [form] = Form.useForm()

  const [filterForm] = Form.useForm()

  const queryClient = useQueryClient()

  const { token: {colorBgLayout} } = theme.useToken()

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

  const onHandleSubmit = async () => {
    await form.validateFields()
    await userMutate(form.getFieldsValue())
    form.resetFields()
    setDrawerOper(false)
  }

  const onFilterChange = (changedFields: FieldData[]) => {
      // console.log(changedFields);
      const changedFiltersFields = changedFields.map((item) => ({
          [item.name[0]]: item.value
      })).reduce((acc,item) => ({...acc, ...item}),{})
      setQueryParams((prev) => ({
        ...prev,
        ...changedFiltersFields
      }))
  }

  if(user?.role !== "admin"){
    return <Navigate to={`/`} replace={true} />
  }

  return (
  <>
  <Space
  orientation="vertical"
  style={{width: "100%"}}
  size={`large`}
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
        title: "Users"
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
      }
    }}
    />

    <Drawer
    title="Create user"
    styles={{body: {background: colorBgLayout}}}
    size={720} 
    destroyOnHidden={true}
    onClick={() => {console.log("Closing")}}
    open={drawerOpen}
    onClose={()=>{
      form.resetFields()
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
      <UserForm />
     </Form>
    </Drawer>
  </Space>
  </>
  )
}

export default Users