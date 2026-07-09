import { LoadingOutlined, PlusOutlined, RightOutlined } from "@ant-design/icons"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Breadcrumb, Button, Descriptions, Drawer, Flex, Form, Grid, Space, Spin, Table, Tag, theme, Typography } from "antd"
import { Link } from "react-router-dom"
import { createCoupon, getCoupons } from "../../http/api"
import { useMemo, useState } from "react"
import { useAuthStore } from "../../store"
import PromosFilter from "./PromosFilter"
import PromoForm from "./forms/PromoForm"
import type { Coupon, CreateCouponData, FieldData } from "../../types/types"
import { PER_PAGE } from "../../constants"
import { debounce } from "lodash"
import { format } from "date-fns"

const Promos = () => {

    const { token: { colorBgLayout } } = theme.useToken()
    const screens = Grid.useBreakpoint()
    const isMobile = !screens.md
    const [form] = Form.useForm()
    const [filterForm] = Form.useForm()
    const { user } = useAuthStore()

    const [queryParams, setQueryParams] = useState({
        perPage: PER_PAGE,
        currentPage: 1,
        tenantId: user!.role === "manager" ? user?.tenant?.id : undefined,
    })

    const [drawerOpen, setDrawerOpen] = useState(false)

    const { data: coupons, isFetching, isError, error } = useQuery({
        queryKey: ["coupons", queryParams],
        queryFn: () => {
            const filteredParams = Object.fromEntries(
                Object.entries(queryParams).filter((item) => !!item[1])
            )
            const queryString = new URLSearchParams(
                filteredParams as unknown as Record<string, string>
            ).toString()

            return getCoupons(queryString).then((res) => res.data)
        },
    })

    const queryClient = useQueryClient()

    const { mutate: couponMutate, isPending: isCreatingLoading } = useMutation({
        mutationKey: ["coupon"],
        mutationFn: async (data: CreateCouponData) => createCoupon(data).then((res) => res.data),
        onSuccess: async () => {
            queryClient.invalidateQueries({ queryKey: ["coupons"] })
            form.resetFields()
            setDrawerOpen(false)
        },
    })

    const onHandleSubmit = async () => {
        await form.validateFields()
        const data = form.getFieldsValue()
        couponMutate({
            ...data,
            tenantId: user?.role === "manager" ? user.tenant?.id : data.tenantId,
        })
    }

    const debouncedQUpdate = useMemo(() => {
        return debounce((value: string | undefined) => {
            setQueryParams((prev) => ({ ...prev, q: value, currentPage: 1 }))
        }, 500)
    }, [])

    const onFilterChange = (changedFields: FieldData[]) => {
        const changedFilterFields = changedFields
            .map((item) => ({
                [item.name[0]]: item.value,
            }))
            .reduce((acc, item) => ({ ...acc, ...item }), {})

        if ("q" in changedFilterFields) {
            debouncedQUpdate(changedFilterFields.q)
        } else {
            setQueryParams((prev) => ({ ...prev, ...changedFilterFields, currentPage: 1 }))
        }
    }

    const columns = [
        {
            title: "Title",
            dataIndex: "title",
            key: "title",
            render: (text: string) => <div style={{ wordBreak: "break-word" }}>{text}</div>,
        },
        ...(isMobile ? [] : [{
            title: "Code",
            dataIndex: "code",
            key: "code",
            render: (text: string) => <div style={{ wordBreak: "break-word" }}>{text}</div>,
        }]),
        {
            title: "Discount",
            dataIndex: "discount",
            key: "discount",
            width: 100,
            render: (_: string, record: Coupon) => (
                <Tag color="blue">{record.discount}%</Tag>
            ),
        },
        ...(isMobile ? [] : [{
            title: "Valid Upto",
            dataIndex: "validUpto",
            key: "validUpto",
            render: (text: string) => (
                <Typography.Text>
                    {format(new Date(text), "dd/MM/yyyy hh:mm a")}
                </Typography.Text>
            ),
        }]),
    ]

    return (
        <>
            <Space orientation="vertical" size="large" style={{ width: "100%" }}>
                <Flex justify="space-between" align="center">
                    <Breadcrumb
                        separator={<RightOutlined />}
                        items={[
                            { title: <Link to={"/"}>Dashboard</Link> },
                            { title: "Promos" },
                        ]}
                    />
                    <Space>
                        {isFetching && (
                            <Spin
                                indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
                            />
                        )}
                        {isError && (
                            <Typography.Text type="danger">{error.message}</Typography.Text>
                        )}
                    </Space>
                </Flex>

                <Form form={filterForm} onFieldsChange={onFilterChange}>
                    <PromosFilter>
                        <Button
                            type="primary"
                            icon={<PlusOutlined />}
                            onClick={() => setDrawerOpen(true)}
                        >
                            Add Coupon
                        </Button>
                    </PromosFilter>
                </Form>

                <Table
                    columns={columns}
                    dataSource={coupons?.data}
                    rowKey={"_id"}
                    loading={isFetching}
                    expandable={isMobile ? {
                      expandedRowRender: (record: Coupon) => (
                        <Descriptions size="small" column={1} bordered>
                          <Descriptions.Item label="Code">{record.code}</Descriptions.Item>
                          <Descriptions.Item label="Valid Upto">{format(new Date(record.validUpto), "dd/MM/yyyy hh:mm a")}</Descriptions.Item>
                        </Descriptions>
                      ),
                      rowExpandable: () => true,
                    } : undefined}
                    pagination={{
                        total: coupons?.total,
                        pageSize: queryParams.perPage,
                        current: queryParams.currentPage,
                        onChange: (page) => {
                            setQueryParams((prev) => ({ ...prev, currentPage: page }))
                        },
                        showTotal: (total: number, range: number[]) => {
                            return `Showing ${range[0]}-${range[1]} of ${total} items`
                        },
                    }}
                />

                <Drawer
                    title="Create Coupon"
                    styles={{ body: { background: colorBgLayout } }}
                    width={Math.min(720, window.innerWidth - 48)}
                    destroyOnHidden={true}
                    open={drawerOpen}
                    onClose={() => {
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
                                loading={isCreatingLoading}
                                onClick={onHandleSubmit}
                                type="primary"
                            >
                                Submit
                            </Button>
                        </Space>
                    }
                >
                    <Form layout="vertical" form={form}>
                        <PromoForm />
                    </Form>
                </Drawer>
            </Space>
        </>
    )
}

export default Promos
