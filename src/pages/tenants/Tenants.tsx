import { PlusOutlined, RightOutlined } from "@ant-design/icons"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Breadcrumb, Button, Drawer, Form, Space, Table, theme } from "antd"
import { Link, Navigate } from "react-router-dom"
import { createTenant, getTenants } from "../../http/api"
import { useState } from "react"
import { useAuthStore } from "../../store"
import TenantFilter from "./TenantFilter"
import TenantForm from "./forms/TenantForm"
import type { CreateTenantData } from "../../types/types"

const columns = [
    {
        title: "ID",
        dataIndex: "id",
        key: "id"
    },
    {
        title: "Name",
        dataIndex: "name",
        key: "name",
    },
    {
        title: "Address",
        dataIndex: "address",
        key: "address"
    }
]


const Tenants = () => {

    const { token: {colorBgLayout} } = theme.useToken()

    const [form] = Form.useForm()

    const [drawerOpen, setDrawerOpen] = useState(false);
    const {
        data: tenants,
        isLoading,
        isError,
        error
    } = useQuery({
        queryKey: ["tenants"],
        queryFn: () => {
            return getTenants().then((res) => res.data)
        }
    })

    const { user } = useAuthStore();

    const queryClient = useQueryClient()

    const { mutate: tenantMutate } = useMutation({
        mutationKey: ["tenant"],
        mutationFn: async (data: CreateTenantData) => createTenant(data).then((res) => res.data),
        onSuccess: async() => {
            queryClient.invalidateQueries({
                queryKey: ["tenants"]
            })
            return
        }
    })

    const onHandleSubmit = async () => {
        await form.validateFields()
        tenantMutate(form.getFieldsValue())
        form.resetFields()
        setDrawerOpen(false)
    }


    if(user?.role !== "admin"){
        return <Navigate to={`/`} replace={true} />
    }

    return(
        <>
            <Space orientation="vertical" size="large" style={{ width: '100%' }}>
                <Breadcrumb
                separator={<RightOutlined />}
                items={[{
                    title: <Link to={`/`}>
                        Dashboard
                    </Link>
                },
            {
                title: "Tenants"
            }]}
                />
            {isLoading && <div>Loading...</div>}
            {isError && <div>{error.message}</div>}

            <TenantFilter   
            onFilterChange={(filterName: string, filterValue: string) => {
                console.log(filterName, filterValue);
            }}  
            >   
                <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={() => setDrawerOpen(true)}
                >
                    Add Restaurant
                </Button>
            </TenantFilter>
            
            <Table columns={columns} dataSource={tenants} rowKey={"id"} />

             <Drawer
                    title="Create restaurant"
                    styles={{body:{backgroundColor: colorBgLayout}}}
                    size={720}
                    destroyOnHidden={true}
                    open={drawerOpen}
                    onClose={() => {
                        setDrawerOpen(false);
                    }}
                    extra={
                        <Space>
                            <Button
                            onClick={() => {
                                form.resetFields()
                                setDrawerOpen(false)
                            }}
                            >Cancel</Button>
                            <Button
                            onClick={onHandleSubmit}
                            type="primary">Submit</Button>
                        </Space>
                    }>
                    <Form
                    layout="vertical"
                    form={form}
                    >
                        <TenantForm />
                    </Form>
                </Drawer>
            </Space>
        </>
    )
}

export default Tenants