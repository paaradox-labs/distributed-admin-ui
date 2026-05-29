import { Card, Col, Form, Input, Row, Select, Space, Switch, Typography, Upload } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import { getCategories, getTenants } from '../../../http/api';
import type { Category, Tenant } from '../../../types/types';
import Attributes from './Attributes';
import Pricing from './Pricing';

const ProductForm = () => {
    const selectedCategory = Form.useWatch('categoryId');
    console.log(selectedCategory);
    
    const { data: categories } = useQuery({
        queryKey: ['categories'],
        queryFn: () => {
            return getCategories();
        },
    });

    const { data: restaurants } = useQuery({
        queryKey: ['restaurants'],
        queryFn: () => {
            return getTenants(`perPage=100&currentPage=1`);
        },
    });

    return (
        <Row>
            <Col span={24}>
                <Space style={{width: "100%"}} orientation="vertical" size="large">
                    <Card title="Product info" variant={`borderless`}>
                        <Row gutter={20}>
                            <Col span={12}>
                                <Form.Item
                                    label="Product name"
                                    name="name"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Product name is required',
                                        },
                                    ]}>
                                    <Input size="large" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label="Category"
                                    name="categoryId"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Category is required',
                                        },
                                    ]}>
                                    <Select
                                        size="large"
                                        style={{ width: '100%' }}
                                        allowClear={true}
                                        onChange={() => {}}
                                        placeholder="Select category" 
                                            options={
                                                categories?.data.map((category: Category) => ({
                                                    value: JSON.stringify(category),
                                                    label: category.name
                                                }))
                                            }
                                             />
                                </Form.Item>
                            </Col>
                            <Col span={24}>
                                <Form.Item
                                    label="Description"
                                    name="description"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Description is required',
                                        },
                                    ]}>
                                    <Input.TextArea
                                        rows={2}
                                        maxLength={100}
                                        style={{ resize: 'none' }}
                                        size="large"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Card>
                    <Card title="Product image" variant={`borderless`}>
                        <Row gutter={20}>
                            <Col span={12}>
                                <Form.Item
                                    label=""
                                    name="image"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please upload a product image',
                                        },
                                    ]}>
                                    <Upload listType="picture-card">
                                        <Space orientation="vertical">
                                            <PlusOutlined />    
                                            <Typography.Text>Upload</Typography.Text>
                                        </Space>
                                    </Upload>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Card>

                    <Card title="Tenant info" variant="borderless">
                        <Row gutter={24}>
                            <Col span={24}>
                                <Form.Item
                                    label="Restaurant"
                                    name="tenantId"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Restaurant is required',
                                        },
                                    ]}>
                                    <Select
                                        size="large"
                                        style={{ width: '100%' }}
                                        allowClear={true}
                                        onChange={() => {}}
                                        placeholder="Select restaurant"
                                        options={
                                            restaurants?.data.data.map((tenant: Tenant) => ({
                                                value: tenant.id,
                                                label: tenant.name
                                            })
                                            )}
                                        /> 
                                </Form.Item>
                            </Col>
                        </Row>
                    </Card>

                    {selectedCategory && <Pricing selectedCategory={selectedCategory} />}
                    {selectedCategory && <Attributes selectedCategory={selectedCategory} />}

                    <Card title="Other properties" variant="borderless">
                        <Row gutter={24}>
                            <Col span={24}>
                                <Space>
                                    <Form.Item name="isPublish">
                                        <Switch
                                            defaultChecked={false}
                                            onChange={() => {}}
                                            checkedChildren="Yes"
                                            unCheckedChildren="No"
                                        />
                                    </Form.Item>
                                    <Typography.Text style={{ marginBottom: 22, display: 'block' }}>
                                        Published
                                    </Typography.Text>
                                </Space>
                            </Col>
                        </Row>
                    </Card>
                </Space>
            </Col>
        </Row>
    );
};

export default ProductForm;