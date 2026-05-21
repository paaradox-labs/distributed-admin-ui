import { PlusOutlined, RightOutlined } from "@ant-design/icons"
import { useQuery } from "@tanstack/react-query"
import { Link, Navigate } from "react-router-dom"
import { getUsers } from "../../http/api"
import { Breadcrumb, Button, Drawer, Form, Space, Table, theme } from "antd"
import type { User } from "../../types/types"
import { useAuthStore } from "../../store"
import UsersFilter from "./UsersFilter"
import { useState } from "react"
import UserForm from "./forms/UserForm"

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
  }
]

const Users = () => {

  const { token: {colorBgLayout} } = theme.useToken()

  const [drawerOpen, setDrawerOper] = useState(false)

  const { data: users, isLoading, isError, error } = useQuery({
    queryKey: ["users"],
    queryFn: () =>  {
      return getUsers().then((res) => res.data)
    },
  })

  const { user } = useAuthStore()

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
      isLoading && <div>
        Loading...
      </div>
    }
    {
      isError && <div>
        {error.message}
      </div>
    }
    <UsersFilter
    onFilterChange={( filterName: string, filterValue: string) => {
        console.log(filterName, filterValue);
    }}
    >
      <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setDrawerOper(true)}
          >
            Add User
          </Button>
    </UsersFilter>
    <Table columns={columns} dataSource={users} rowKey={"id"} />

    <Drawer
    title="Create user"
    styles={{body: {background: colorBgLayout}}}
    size={720} 
    destroyOnHidden={true}
    onClick={() => {console.log("Closing")}}
    open={drawerOpen}
    onClose={()=>{setDrawerOper(false)}}
    extra={
      <Space>
        <Button>
          Cancel
        </Button>
        <Button
        type="primary"
        >
          Submit
        </Button>
      </Space>
    }
    >
     <Form
     layout="vertical"
     >
      <UserForm />
     </Form>
    </Drawer>
  </Space>
  </>
  )
}

export default Users