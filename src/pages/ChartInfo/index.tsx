import { listMyChartByPageUsingPOST } from '@/services/bobochangBI/chartController';
import '@umijs/max';
import { Card, Divider, List, message } from 'antd';
import DescriptionsItem from 'antd/es/descriptions/Item';
import Search from 'antd/es/input/Search';
import ReactECharts from 'echarts-for-react';
import React, { useEffect, useState } from 'react';

const ChartInfo: React.FC = () => {
  const initSearchParams = {
    current: 1,
    pageSize: 4,
  };

  const [searchParams, setSearchParams] = useState<API.ChartQueryRequest>({ ...initSearchParams });
  const [chartList, setChartList] = useState<API.Chart[]>();
  const [total, setTotal] = useState(0);
  const [loading, setLoding] = useState<boolean>(false);

  const loadData = async () => {
    try {
      const res = await listMyChartByPageUsingPOST(searchParams);
      setLoding(true);
      if (res.data) {
        setChartList(res.data.records ?? []);
        setTotal(res.data.total ?? 0);
        // 隐藏图表 title
        if (res.data.records) {
          res.data.records.forEach((item) => {
            const chartOption = JSON.parse(item.genChart ?? '{}');
            chartOption.title = undefined;
            item.genChart = JSON.stringify(chartOption);
          });
        }
      } else {
        message.error('获取我的图表失败');
      }
    } catch (e: any) {
      message.error('获取我的图表失败 ' + e.message);
    }
    setLoding(false);
  };

  useEffect(() => {
    loadData();
  }, [searchParams]);

  return (
    <div className="chartInfo">
      <Search
        placeholder="请输入图表名称"
        loading={loading}
        onSearch={(value) => setSearchParams({ ...searchParams, name: value })}
      />
      <Divider />
      <List
        grid={{
          gutter: 16,
          xs: 1,
          sm: 1,
          md: 1,
          lg: 2,
          xl: 2,
          xxl: 2,
        }}
        loading={loading}
        pagination={{
          onChange: (page, pageSize) => {
            setSearchParams({ ...searchParams, current: page, pageSize });
          },
          current: searchParams.current,
          pageSize: searchParams.pageSize,
          total: total,
        }}
        dataSource={chartList}
        renderItem={(item) => (
          <List.Item key={item.id}>
            <Card style={{ width: '100%' }}>
              <List.Item.Meta
                title={item.name}
                description={item.chartType ? '图表类型: ' + item.chartType : undefined}
              />
              <div style={{ marginBottom: 12 }} />
              <DescriptionsItem>{'分析目标' + item.goal}</DescriptionsItem>
              <ReactECharts option={item.genChart && JSON.parse(item.genChart)} />
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};
export default ChartInfo;
