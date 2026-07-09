import { Avatar, Breadcrumb, Card, Col, Flex, List, Row, Space, Tag, Typography } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import type { Order } from '../../types/types';
import { getSingleOrder } from '../../http/api';
import { colorMapping } from '../../constants';

const SingleOrder = () => {

    const params = useParams()
    const orderId = params.orderId;

    const {data: order} = useQuery<Order>({
        queryKey: ["order", orderId],
        queryFn: () => {
            const queryString = new URLSearchParams({
                fields: "cart,address,paymentMode,tenantId,total,comment,orderStatus,paymentStatus",
            }).toString();
            return getSingleOrder(orderId as string, queryString).then(res => res.data)
        }
    })

    if(!order){
        return null
    }

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
            </Flex>

            <Row gutter={24}>
                <Col span={14}>
                    <Card
                        title="Order Details"
                        extra={
                            <Tag
                                variant="filled"
                                color={colorMapping[order.orderStatus] ?? 'processing'}>
                                {(order.orderStatus)}
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
                    <Card title="Customer Details">some content goes here...</Card>
                </Col>
            </Row>
            
        </Space>
    );
};

export default SingleOrder;