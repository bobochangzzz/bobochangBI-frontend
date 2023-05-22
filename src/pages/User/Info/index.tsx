import { getLoginUserUsingGET, updateMyUserUsingPOST } from '@/services/bobochangBI/userController';
import { useModel } from '@@/exports';
import { LoadingOutlined, PlusOutlined } from '@ant-design/icons';
import { ProForm, ProFormText } from '@ant-design/pro-components';
import { Col, message, Row, Space, Upload, UploadFile, UploadProps } from 'antd';
import { RcFile, UploadChangeParam } from 'antd/es/upload';
import React, { useState } from 'react';

type LayoutType = Parameters<typeof ProForm>[0]['layout'];
const LAYOUT_TYPE_HORIZONTAL = 'horizontal';

const Info: React.FC = () => {
  const [formLayoutType] = useState<LayoutType>(LAYOUT_TYPE_HORIZONTAL);
  const { initialState, setInitialState } = useModel('@@initialState');
  const [previewOpen, setPreviewOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>();
  const formItemLayout =
    formLayoutType === LAYOUT_TYPE_HORIZONTAL
      ? {
          labelCol: { span: 4 },
          wrapperCol: { span: 14 },
        }
      : null;
  const getBase64 = (file: RcFile): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
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
  const handleChange: UploadProps['onChange'] = (info: UploadChangeParam<UploadFile>) => {
    if (info.file.status === 'uploading') {
      setLoading(true);
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj as RcFile, (url: any) => {
        setLoading(false);
        setImageUrl(url);
      });
      // todo 向上传头像接口发送请求
    }
  };

  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  return (
    <ProForm<API.UserUpdateMyRequest>
      {...formItemLayout}
      layout={formLayoutType}
      submitter={{
        render: (props, doms) => {
          return formLayoutType === LAYOUT_TYPE_HORIZONTAL ? (
            <Row>
              <Col span={14} offset={4}>
                <Space>{doms}</Space>
              </Col>
            </Row>
          ) : (
            doms
          );
        },
      }}
      onFinish={async (values) => {
        await updateMyUserUsingPOST({
          ...values,
        });
        console.log(values);
        message.success('提交成功');
      }}
      params={{}}
      request={async () => {
        const res: any = await getLoginUserUsingGET();
        if (res.code === 0) {
          return {
            id: res.data.id,
            userName: res.data.userName,
            userAvatar: res.data.userAvatar,
            userProfile: res.data.userProfile,
          };
        }
        return {};
      }}
    >
      <ProFormText width="md" name="userName" label="用户昵称" />
      <ProFormText width="md" name="userAvatar" label="用户头像">
        <Upload
          name="avatar"
          listType="picture-circle"
          className="avatar-uploader"
          showUploadList={false}
          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
          beforeUpload={beforeUpload}
          onChange={handleChange}
        >
          {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
        </Upload>
      </ProFormText>
    </ProForm>
  );
};
export default Info;
