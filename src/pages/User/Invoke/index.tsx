import { Card, Descriptions, Typography } from 'antd';
import React from 'react';

const Invoke: React.FC = () => {
  const { Paragraph } = Typography;
  return (
    <>
      <Card title="开发者密钥（调用接口凭证）" style={{ whiteSpace: 'pre-wrap' }}>
        <Descriptions>
          <Descriptions.Item label="AccessKey">
            <Paragraph copyable>后端回传展示AccessKey</Paragraph>
          </Descriptions.Item>
        </Descriptions>
        <Descriptions>
          <Descriptions.Item label="SecretKey">
            <Paragraph copyable style={{ paddingLeft: 4 }}>
              后端回传展示SecretKey
            </Paragraph>
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </>
  );
};

export default Invoke;
