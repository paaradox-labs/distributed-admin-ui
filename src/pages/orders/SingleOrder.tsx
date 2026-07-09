import { Avatar, Breadcrumb, Card, Col, Flex, List, Row, Select, Space, Tag, Typography } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import { Link, useParams } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { Order, OrderStatus } from '../../types/types';
import { changeStatus, getSingleOrder } from '../../http/api';
import { colorMapping } from '../../constants';
import { format } from 'date-fns';

const orderStatusOptions = [
    {
        value: 'received',
        label: 'Received',
    },
    {
        value: 'confirmed',
        label: 'Confirmed',
    },
    {
        value: 'prepared',
        label: 'Prepared',
    },
    {
        value: 'out_for_delivery',
        label: 'Out For Delivery',
    },
    {
        value: 'delivered',
        label: 'Delivered',
    },
];

const SingleOrder = () => {

    const params = useParams()
    const orderId = params.orderId; 

    const {data: order} = useQuery<Order>({
        queryKey: ["order", orderId],
        queryFn: () => {
            const queryString = new URLSearchParams({
                fields: "cart,address,paymentMode,tenantId,total,comment,orderStatus,paymentStatus,createdAt",
            }).toString();
            return getSingleOrder(orderId as string, queryString).then(res => res.data)
        }
    })
    
    const queryClient = useQueryClient();

    const { mutate } = useMutation({
        mutationKey: ['order', orderId],
        mutationFn: async (status: OrderStatus) => {
            return changeStatus(orderId as string, { status }).then((res) => res.data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['order', orderId] });
        },
    });

    if(!order){
        return null
    }

    const handleStatusChange = (status: OrderStatus) => {
        mutate(status);
    };

    return (
        <Space orientation="vertical" size="large" style={{ width: '100%' }}>
            <Flex justify="space-between">
                <Breadcrumb
                    separator={<RightOutlined />}
                    items={[
                        { title: <Link to="/">Dashboard</Link> },
                        { title: <Link to="/orders">Orders</Link> },
                        { title: `Order ${order._id}` },
                    ]}
                />

                 <Space>
                    <Typography.Text>Change Order Status</Typography.Text>
                    <Select
                        defaultValue={order.orderStatus}
                        style={{
                            width: 150,
                        }}
                        onChange={handleStatusChange}
                        options={orderStatusOptions}
                    />
                </Space>
            </Flex>

            <Row gutter={24}>
                <Col span={14}>
                    <Card
                        title="Order Details"
                        extra={
                            <Tag
                                variant="filled"
                                color={colorMapping[order.orderStatus] ?? 'processing'}>
                                {/* have to do this or else would lose colour mapping in typography */}
                                {order.orderStatus.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())} 
                            </Tag>
                        }>
                        <List
                            itemLayout="horizontal"
                            dataSource={order.cart}
                            renderItem={(item) => (
                                <List.Item>
                                    <List.Item.Meta
                                        avatar={<Avatar src={item.image} />}
                                        title={item.name}
                                        description={item.chosenConfiguration.selectedToppings.flat()
                                            .map((topping) => topping.name)
                                            .join(', ')}
                                    />

                                    <Space size={'large'}>
                                        <Typography.Text>
                                            {Object.values(
                                                item.chosenConfiguration.priceConfiguration
                                            ).join(', ')}
                                        </Typography.Text>

                                        <Typography.Text>
                                            {item.qty} Item{item.qty > 1 ? 's' : ''}
                                        </Typography.Text>
                                    </Space>
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>
                <Col span={10}>
                   <Card title="Customer Details">
                        <Space orientation="vertical">
                            <Flex style={{ flexDirection: 'column' }}>
                                <Typography.Text type="secondary">Name</Typography.Text>
                                <Typography.Text>
                                    {order.customerId.firstName + ' ' + order.customerId.lastName}
                                </Typography.Text>
                            </Flex>

                            <Flex style={{ flexDirection: 'column' }}>
                                <Typography.Text type="secondary">Address</Typography.Text>
                                <Typography.Text>{order.address}</Typography.Text>
                            </Flex>

                            <Flex style={{ flexDirection: 'column' }}>
                                <Typography.Text type="secondary">Payment Method</Typography.Text>
                                <Typography.Text style={{ textTransform: 'capitalize' }}>{order.paymentMode}</Typography.Text>
                            </Flex>

                            <Flex style={{ flexDirection: 'column' }}>
                                <Typography.Text type="secondary">Payment Status</Typography.Text>
                                <Typography.Text>
                                    {(order.paymentStatus)}
                                </Typography.Text>
                            </Flex>

                            <Flex style={{ flexDirection: 'column' }}>
                                <Typography.Text type="secondary">Order Amount</Typography.Text>
                                <Typography.Text>₹{order.total}</Typography.Text>
                            </Flex>

                            <Flex style={{ flexDirection: 'column' }}>
                                <Typography.Text type="secondary">Order Time</Typography.Text>
                                <Typography.Text>
                                    {format(new Date(order.createdAt), 'dd/MM/yyyy HH:mm')}
                                </Typography.Text>
                            </Flex>

                            {order.comment && (
                                <Flex style={{ flexDirection: 'column' }}>
                                    <Typography.Text type="secondary">Comment</Typography.Text>
                                    <Typography.Text>{order.comment}</Typography.Text>
                                </Flex>
                            )}
                        </Space>
                    </Card>
                </Col>
            </Row>
            
        </Space>
    );
};

export default SingleOrder;