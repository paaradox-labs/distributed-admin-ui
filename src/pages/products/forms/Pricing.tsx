import { Card, Col, Form, InputNumber, Row, Space, Typography } from "antd"
import type { Category } from "../../../types/types"

type PricingProps  = {
    selectedCategory: string
}

const Pricing = ({selectedCategory}: PricingProps) => {

    const category: Category | null = selectedCategory ? JSON.parse(selectedCategory) : null

    if(!category){
        return null
    }

  return <Card title={<Typography.Text>Product price</Typography.Text>} variant={`borderless`}>
    {Object.entries(category?.priceConfiguration).map(([configurationKey, configurationValue]) => {
        return <div key={configurationKey}>
            <Space
            orientation="vertical"
            size={`large`}
            style={{width: "100%"}}
            >
                <Typography.Text>
                    {`${configurationKey} (${configurationValue.priceType})`}
                </Typography.Text>
                <Row
                gutter={20}
                >
                    {
                        configurationValue.availableOptions.map((option: string) => {
                            return(
                                <Col
                                span={8}
                                key={option}
                                >
                                    <Form.Item
                                    label={option}
                                    name={['priceConfiguration', JSON.stringify({configurationKey: configurationKey, priceType: configurationValue.priceType}),
                                        option,
                                    ]}
                                    >
                                        <InputNumber 
                                        style={{width: "100%"}} 
                                        formatter={(value) => `₹${value}`}
                                        parser={(value) => value!.replace(/₹\s/g, "")}
                                        />
                                    </Form.Item>
                                </Col>
                            )
                        })
                    }
                </Row>
            </Space>
        </div>
    })}
  </Card>
}

export default Pricing