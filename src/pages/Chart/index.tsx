import { genChartByAiUsingPOST } from '@/services/bobochangBI/chartController';
import { UploadOutlined } from '@ant-design/icons';
import '@umijs/max';
import { Button, Card, Col, Divider, Form, message, Row, Select, Space, Spin, Upload } from 'antd';
import Input from 'antd/es/input/Input';
import TextArea from 'antd/es/input/TextArea';
import ReactECharts from 'echarts-for-react';
import React, { useState } from 'react';

const Chart: React.FC = () => {
  const [chart, setChart] = useState<API.BiVO>();
  const [option, setOption] = useState<any>();
  const [submitting, setSubmitting] = useState(false);
  /**
   * 提交
   * @param values
   */
  const onFinish = async (values: any) => {
    //避免重复提交
    if (submitting) {
      return;
    }
    setSubmitting(true);
    setChart(undefined);
    setOption(undefined);
    const params = {
      ...values,
      file: undefined,
    };
    // 向后端发起请求获取数据 并回传展示
    try {
      const res = await genChartByAiUsingPOST(params, {}, values.file.file.originFileObj);
      console.log(values.file.file.originFileObj);
      if (!res?.data) {
        message.error('分析失败');
      } else {
        const chartOption = JSON.parse(res.data.genChart ?? '');
        if (!chartOption) {
          throw new Error('图表代码解析失败');
        } else {
          setChart(res.data);
          setOption(chartOption);
        }
        message.success('分析成功');
      }
    } catch (e: any) {
      message.error('分析失败 ' + e.message);
    }
    setSubmitting(false);
  };

  return (
    <div className="chart">
      <Row gutter={24}>
        <Col span={12}>
          <Card title="数据智能分析">
            <Form
              name="chart"
              labelAlign="left"
              labelCol={{ span: 4 }}
              onFinish={onFinish}
              initialValues={{}}
              style={{ maxWidth: 600, whiteSpace: 'pre-wrap' }}
            >
              <Form.Item
                name="goal"
                label="分析目标"
                rules={[{ required: true, message: '请输入分析目标' }]}
              >
                <TextArea placeholder="请输入分析需求 如：分析网站用户增长情况" />
              </Form.Item>
              <Form.Item
                name="file"
                label="原始数据"
                rules={[{ required: true, message: '请输入分析目标' }]}
              >
                <Upload name="file" maxCount={1}>
                  <Button icon={<UploadOutlined />}>上传Excel表格</Button>
                </Upload>
              </Form.Item>
              <Form.Item name="name" label="图表名称">
                <Input placeholder="请输入图表名称" />
              </Form.Item>
              <Form.Item name="chartType" label="图表类型">
                <Select
                  options={[
                    { value: '折线图', label: '折线图' },
                    { value: '平滑折线图', label: '平滑折线图' },
                    { value: '渐变折线图', label: '渐变折线图' },
                    { value: '柱状图', label: '饼状图' },
                    { value: '饼图', label: '饼图' },
                    { value: '散点图', label: '散点图' },
                    { value: '雷达图', label: '雷达图' },
                  ]}
                />
              </Form.Item>

              <Form.Item wrapperCol={{ span: 12, offset: 4 }}>
                <Space>
                  <Button htmlType="reset">重置</Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={submitting}
                    disabled={submitting}
                  >
                    智能分析
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        </Col>
        <Col span={12} style={{ whiteSpace: 'pre-wrap' }}>
          <Card title="分析图表">
            {option ? <ReactECharts option={option} /> : <div>请先在左侧进行提交操作</div>}
            <Spin spinning={submitting} />
          </Card>
          <Divider />
          <Card title="分析结论">
            {chart?.genResult ?? <div>请先在左侧进行提交操作</div>}
            <Spin spinning={submitting} />
          </Card>
        </Col>
      </Row>
    </div>
  );
};
export default Chart;
