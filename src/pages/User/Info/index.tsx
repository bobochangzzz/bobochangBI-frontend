import { uploadFileUsingPOST } from '@/services/bobochangBI/fileController';
import { updateMyUserUsingPOST } from '@/services/bobochangBI/userController';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Card, Form, message, Space, Upload } from 'antd';
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
  // const handleChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
  //   if (info.file.status === 'uploading') {
  //     setLoading(true);
  //     return;
  //   }
  //   if (info.file.status === 'done') {
  //     // Get this url from response in real world.
  //     getBase64(info.file.originFileObj as RcFile, (url) => {
  //       setLoading(false);
  //       setImageUrl(url);
  //     });
  //   }
  // };

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
      }
    } catch (e: any) {
      message.error('修改失败 ' + e.message);
    }
    setSubmitting(false);
  };
  return (
    <>
      <Card title="个人设置" style={{ whiteSpace: 'pre-wrap' }}>
        <Form name="userInfo" labelAlign="left" onFinish={onFinish}>
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

          <Form.Item wrapperCol={{ span: 20, offset: 20 }}>
            <Space>
              <Button htmlType="reset">重置</Button>
              <Button type="primary" htmlType="submit" loading={submitting} disabled={submitting}>
                修改
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </>
  );
};

export default Info;
