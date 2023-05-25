import { uploadFileUsingPOST } from '@/services/bobochangBI/fileController';
import { updateMyUserUsingPOST } from '@/services/bobochangBI/userController';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { history } from '@umijs/max';
import { Button, Card, Col, Descriptions, Divider, Form, message, Row, Upload } from 'antd';
import Input from 'antd/es/input/Input';
import type { RcFile } from 'antd/es/upload/interface';
import React, { useState } from 'react';

const getBase64 = (img: RcFile, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

const beforeUpload = (file: RcFile) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
};

const Info: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();
  const [avatarUrl, setAvatarUrl] = useState<string>();
  const [submitting, setSubmitting] = useState(false);

  const uploadImg = async (values: any) => {
    const res = await uploadFileUsingPOST(
      values.name,
      {
        biz: 'user_avatar',
      },
      values.file,
    );
    console.log(res.data);
    setAvatarUrl(res.data);
    getBase64(values.file as RcFile, (url) => {
      setLoading(false);
      setImageUrl(url);
    });
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const onFinish = async (values: any) => {
    if (submitting) {
      return;
    }
    setSubmitting(true);
    console.log(values);
    const body = {
      userAvatar: avatarUrl,
      userName: values.userName,
    };
    try {
      const res = await updateMyUserUsingPOST(body);
      console.log(res);
      if (!res?.data) {
        message.error('修改失败');
      } else {
        message.success('修改成功');
        history.replace('/');
        location.reload();
      }
    } catch (e: any) {
      message.error('修改失败 ' + e.message);
    }
    setSubmitting(false);
  };

  return (
    <>
      <Card title="个人设置" style={{ whiteSpace: 'pre-wrap' }}>
        <Form name="userSetting" labelAlign="left" onFinish={onFinish}>
          <Form.Item name="userName" label="用户名称">
            <Input></Input>
          </Form.Item>
          <Form.Item name="userAvatar" label="用户头像">
            <Upload
              name="avatarUrl"
              maxCount={1}
              listType="picture-card"
              className="avatar-uploader"
              customRequest={uploadImg}
              showUploadList={false}
              beforeUpload={beforeUpload}
              // onChange={handleChange}
            >
              {imageUrl ? (
                <img src={imageUrl} alt="avatar" style={{ width: '100%' }} />
              ) : (
                uploadButton
              )}
            </Upload>
          </Form.Item>

          <Form.Item style={{ marginTop: 32 }}>
            <Row
              style={{
                marginLeft: -12,
                marginRight: -12,
                display: 'flex',
                justifyContent: 'flex-end',
              }}
            >
              <Col style={{ paddingLeft: 12, paddingRight: 12 }}>
                <Button htmlType="reset">重置</Button>
              </Col>
              <Col style={{ paddingLeft: 12, paddingRight: 12 }}>
                <Button type="primary" htmlType="submit" loading={submitting} disabled={submitting}>
                  修改
                </Button>
              </Col>
            </Row>
          </Form.Item>
        </Form>
      </Card>
      <Divider />
      <Card title="个人信息" style={{ whiteSpace: 'pre-wrap' }}>
        <Descriptions>
          <Descriptions.Item label="剩余调用次数">2</Descriptions.Item>
        </Descriptions>
        <Descriptions>
          <Descriptions.Item label="累计调用次数">52</Descriptions.Item>
        </Descriptions>
      </Card>
    </>
  );
};

export default Info;
