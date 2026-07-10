import { Breadcrumb, Button, Descriptions, Flex, Grid, message, Space, Table, Tag, Typography } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getOrders } from '../../http/api';
import { format } from 'date-fns';
import { OrderEvents, PaymentMode, PaymentStatus, type Order } from '../../types/types';
import { colorMapping } from '../../constants';
import { useEffect } from 'react';
import socket from '../../lib/socket';
import { useAuthStore } from '../../store';

// todo: make this dynamic.
const TENANT_ID = 10;

const Orders = () => {
    const queryClient = useQueryClient()
    const {user} = useAuthStore()

    const [messageApi, contextHolder] = message.useMessage()

    useEffect(() => {
        if(user?.tenant){
            socket.on("order-update", (data) => {
                // todo: data.event_type = 
                if((data.event_type === OrderEvents.ORDER_CREATE && data.data.paymentMode === PaymentMode.CASH) || 
                    data.event_type === OrderEvents.PAYMENT_STATUS_UPDATE && data.data.paymentStatus === PaymentStatus.PAID && 
                    data.data.paymentMode === PaymentMode.CARD){
                    queryClient.setQueryData(["orders"], (old: Order[]) => [data.data, ...old])
                    
                    messageApi.open({
                        type: "success",
                        content: "New Order Received."
                    })
                }
                console.log("Data received: ", data);
            })
            socket.on("join",(data) => {
                console.log("User joined in:", data.roomId);
            })
            socket.emit("join", {
            tenantId: user.tenant.id
            } )
    }      
    
    return () => {
        socket.off("join")
        socket.off("order-update")
    }
},[user?.tenant])

    const screens = Grid.useBreakpoint();
    const isMobile = !screens.md;

    const { data: orders } = useQuery({
        queryKey: ['orders'],
        queryFn: () => {
            const queryString = new URLSearchParams({ tenantId: String(TENANT_ID) }).toString();
            return getOrders(queryString).then((res) => res.data);
        },
    });

    const columns = [
        ...(isMobile
            ? []
            : [
                  {
                      title: 'Order ID',
                      dataIndex: '_id',
                      key: '_id',
                      render: (_text: string, record: Order) => {
                          return <Typography.Text>{record._id}</Typography.Text>;
                      },
                  },
                  {
                      title: 'Address',
                      dataIndex: 'address',
                      key: 'address',
                      render: (_text: string, record: Order) => {
                          return <Typography.Text>{record.address}</Typography.Text>;
                      },
                  },
                  {
                      title: 'Comment',
                      dataIndex: 'comment',
                      key: 'comment',
                      render: (_text: string, record: Order) => {
                          return <Typography.Text>{record?.comment}</Typography.Text>;
                      },
                  },
                  {
                      title: 'Payment Mode',
                      dataIndex: 'paymentMode',
                      key: 'paymentMode',
                      render: (_text: string, record: Order) => {
                          return <Typography.Text style={{ textTransform: 'capitalize' }}>{record.paymentMode}</Typography.Text>;
                      },
                  },
                  {
                      title: 'Status',
                      dataIndex: 'orderStatus',
                      key: 'orderStatus',
                      render: (_: boolean, record: Order) => {
                          return (
                              <Tag variant="outlined" color={colorMapping[record.orderStatus]} style={{ whiteSpace: 'nowrap' }}>
                                  {record.orderStatus.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                              </Tag>
                          );
                      },
                  },
                  {
                      title: 'CreatedAt',
                      dataIndex: 'createdAt',
                      key: 'createdAt',
                      render: (text: string) => {
                          return (
                              <Typography.Text>
                                  {format(new Date(text), 'dd/MM/yyyy HH:mm')}
                              </Typography.Text>
                          );
                      },
                  },
              ]),
        {
            title: 'Customer',
            dataIndex: 'customerId',
            key: 'customerId._id',
            render: (_text: string, record: Order) => {
                if (!record.customerId) return '';
                return (
                    <Typography.Text>
                        {record.customerId.firstName + ' ' + record.customerId.lastName}
                    </Typography.Text>
                );
            },
        },
        {
            title: 'Total',
            dataIndex: 'total',
            key: 'total',
            render: (text: string) => {
                return <Typography.Text>₹{text}</Typography.Text>;
            },
        },
        {
            title: 'Actions',
            render: (_: string, record: Order) => {
                return (
                    <Link to={`/orders/${record._id}`}>
                        <Button type="link">Edit</Button>
                    </Link>
                );
            },
        },
    ];

    return (
        <>
        {contextHolder}
        <Space orientation="vertical" size="large" style={{ width: '100%' }}>
            <Flex justify="space-between">
                <Breadcrumb
                    separator={<RightOutlined />}
                    items={[{ title: <Link to="/">Dashboard</Link> }, { title: 'Orders' }]}
                />
            </Flex>

            <Table
                columns={columns}
                rowKey={'_id'}
                dataSource={orders}
                size={isMobile ? 'small' : 'middle'}
                expandable={
                    isMobile
                        ? {
                              expandedRowRender: (record: Order) => (
                                  <Descriptions size="small" column={1} bordered>
                                      <Descriptions.Item label="Order ID">
                                          {record._id}
                                      </Descriptions.Item>
                                      <Descriptions.Item label="Address">
                                          {record.address}
                                      </Descriptions.Item>
                                      {record?.comment && (
                                          <Descriptions.Item label="Comment">
                                              {record.comment}
                                          </Descriptions.Item>
                                      )}
                                      <Descriptions.Item label="Payment Mode">
                                          {record.paymentMode}
                                      </Descriptions.Item>
                                      <Descriptions.Item label="Status">
                                          <Tag variant="outlined" color={colorMapping[record.orderStatus]} style={{ whiteSpace: 'nowrap' }}>
                                              {record.orderStatus.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                                          </Tag>
                                      </Descriptions.Item>
                                      <Descriptions.Item label="CreatedAt">
                                          {format(new Date(record.createdAt), 'dd/MM/yyyy HH:mm')}
                                      </Descriptions.Item>
                                  </Descriptions>
                              ),
                              rowExpandable: () => true,
                          }
                        : undefined
                }
            />
        </Space>
        </>
    );
};

export default Orders;