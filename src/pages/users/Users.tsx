import { RightOutlined } from "@ant-design/icons"
import { useQuery } from "@tanstack/react-query"
import { Link } from "react-router-dom"
import { getUsers } from "../../http/api"
import { Breadcrumb, Space, Table } from "antd"
import type { User } from "../../types/types"

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

  const { data: users, isLoading, isError, error } = useQuery({
    queryKey: ["users"],
    queryFn: () =>  {
      return getUsers().then((res) => res.data)
    },
  })

  return <>
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
    <Table columns={columns} dataSource={users} />
  </Space>
  </>
}

export default Users