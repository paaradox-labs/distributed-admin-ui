import { Card, Col, Form, Input, Row, Select, Space, Switch, Typography, type FormInstance } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { getCategories, getTenants } from '../../../http/api';
import type { Category, Tenant } from '../../../types/types';
import Attributes from './Attributes';
import Pricing from './Pricing';
import ProductImage from './ProductImage';
import { useAuthStore } from '../../../store';

const ProductForm = ({form}: {form: FormInstance}) => {

    const { user } = useAuthStore()
    const selectedCategory = Form.useWatch('categoryId');
    
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
                        <Row gutter={[20, 12]}>
                            <Col xs={24} sm={12}>
                                <Form.Item
                                    label="Product name"
                                    name="name"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Product name is required',
                                        },
                                    ]}>
                                    <Input size="large" placeholder='Pizza' />
                                </Form.Item>
                            </Col>
                            <Col xs={24} sm={12}>
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
                                                    value: category._id,
                                                    label: category.name
                                                }))
                                            }
                                             />
                                </Form.Item>
                            </Col>
                            <Col xs={24}>
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
                                        placeholder='This is a very delicious Pizza'
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
                        <Row gutter={[20, 12]}>
                            <Col xs={24} sm={12}>
                                <ProductImage initialImage={form.getFieldValue("image")} />
                            </Col>
                        </Row>
                    </Card>

                    {
                        user?.role !== "manager" && (
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
                                                value: String(tenant.id),
                                                label: tenant.name
                                            })
                                            )}
                                        /> 
                                </Form.Item>
                            </Col>
                        </Row>
                    </Card>
                        )
                    }

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