// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';
import { UploadFile } from 'antd';
import { RcFile } from 'antd/es/upload/interface';
import { UploadChangeParam } from 'antd/lib/upload';

/** uploadFile POST /api/file/upload */
export async function uploadFileUsingPOST(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: UploadChangeParam<UploadFile>,
  body: {},
  file?: RcFile | undefined,
  options?: { [p: string]: any },
) {
  const formData = new FormData();

  if (file) {
    formData.append('file', file);
  }

  Object.keys(body).forEach((ele) => {
    const item = (body as any)[ele];

    if (item !== undefined && item !== null) {
      formData.append(
        ele,
        typeof item === 'object' && !(item instanceof File) ? JSON.stringify(item) : item,
      );
    }
  });

  return request<API.BaseResponseString_>('/api/file/upload', {
    method: 'POST',
    params: {
      ...params,
    },
    data: formData,
    requestType: 'form',
    ...(options || {}),
  });
}
