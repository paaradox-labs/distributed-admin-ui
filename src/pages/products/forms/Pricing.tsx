import { Card, Col, Form, InputNumber, Row, Space, Typography } from "antd"
import type { Category } from "../../../types/types"
import { useQuery } from "@tanstack/react-query"
import { getCategory } from "../../../http/api"

type PricingProps  = {
    selectedCategory: string
}

const Pricing = ({selectedCategory}: PricingProps) => {

    const { data: fetchedCategory } = useQuery<Category>({
        queryKey: ["category", selectedCategory],
        queryFn: () => {
            return getCategory(selectedCategory).then(res => res.data)
        },
        staleTime: 1000 * 60 * 5 // 5 Mins
    })

    if(!fetchedCategory) return null

  return <Card title={<Typography.Text>Product price</Typography.Text>} variant={`borderless`}>
    {Object.entries(fetchedCategory?.priceConfiguration).map(([configurationKey, configurationValue]) => {
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
                gutter={[20, 12]}
                >
                    {
                        configurationValue.availableOptions.map((option: string) => {
                            return(
                                <Col
                                xs={24} sm={8}
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