import { PlusOutlined } from "@ant-design/icons"
import { Upload, Space, Typography, Form, message, type UploadProps } from "antd"
import { useState } from "react"

const ProductImage = ({initialImage}: {initialImage: string}) => {
    const [messageApi, contextHolder] = message.useMessage()
    const [imageUrl, setImageUrl] = useState<string | null>(initialImage)

        const uploaderConfig: UploadProps = {
        name: "file",
        multiple: false,
        showUploadList: false,
        beforeUpload: (file) => {
            const isJpgOrPng = file.type === "image/jpeg" || file.type  === "image/png"
            if(!isJpgOrPng){
                messageApi.error("You can only upload JPG/PNG file!")
            }

            // todo : size validation
            setImageUrl(URL.createObjectURL(file))

            return false
        }        
    }
  return (
    <Form.Item
                                    label=""
                                    name="image"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please upload a product image',
                                        },
                                    ]}>
                                    <Upload listType="picture-card" {...uploaderConfig} >
                                        {contextHolder}
                                        {
                                            imageUrl ? <img src={imageUrl} alt='picture' style={{width: "100%"}} /> : (
                                        <Space orientation="vertical">
                                            <PlusOutlined />    
                                            <Typography.Text>Upload</Typography.Text>
                                        </Space>
                                            )
                                        }
                                    </Upload>
                                </Form.Item>
  )
}

export default ProductImage