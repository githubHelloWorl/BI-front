import React, {useEffect, useState} from "react";
import {listMyChartByPageUsingPost} from "@/services/BI/chartController";
import {List, message, Avatar} from "antd";
import {useModel} from "@umijs/max";
import ReactECharts from "echarts-for-react";
import {Card} from "antd-mobile-alita";
import Search from "antd/es/input/Search";


/**
 * 我的图表页面
 * @constructor
 */
const MyChart: React.FC = () => {
  const initSearchParams = {
    pageSize: 12,
    current: 1,
  }

  const {initialState} = useModel('@@initialState'); // 全局用户信息
  const loginUser = initialState ?? {};
  const [searchParams, setSearchParams] = useState<API.ChartQueryRequest>({...initSearchParams});
  const [chartList, setChartList] = useState<API.Chart>();
  const [total, setTotal] = useState<number>();


  const loadData = async () => {
    try {
      const res = await listMyChartByPageUsingPost();
      if (res.data) {
        setChartList(res.data.records ?? [])
        setTotal(res.data.total ?? 0);

        // 隐藏图表的 title
        if (res.data.records) {
          res.data.records.forEach(data => {
            const chartOption = JSON.parse(data.genChart ?? '{}');
            chartOption.title = undefined;
            data.genChart = JSON.stringify(chartOption);
          })
        }

      } else {
        message.error("其获取图表失败");
      }
    } catch (e: any) {
      message.error("获取我的图表错误")
    }

  }

  /**
   * 当页面首次渲染,或者变量发生变化时,才会发挥作用
   */
  useEffect(() => {
    loadData();
  }, [searchParams]);


  return (
    <div className="my-chart">
      <div>
        <Search placeholder="请输入图表名称" enterButton onSearch={(value) => {
          // 设置搜索条件
          setSearchParams({
            ...initSearchParams,
            name: value,
          })
        }}/>
      </div>
      <div  className="margin-16" />
      <List
        itemLayout="vertical"
        grid={{gutter: 16, xs: 1, sm: 1, md: 1, lg: 2, xl: 2, xxl: 2,}}
        size="large"
        pagination={{
          onChange: (page, pageSize) => {
            // console.log(page);
            setSearchParams({
              ...searchParams,
              current: page,
              pageSize,
            })
          },
          current: searchParams.current,
          pageSize: searchParams.pageSize,
          total: total,
        }}
        dataSource={chartList}
        renderItem={(item) => (
          <List.Item
            key={item.id}
          >
            <Card>
              <List.Item.Meta
                avatar={<Avatar src={loginUser && loginUser?.userAvatar}/>}
                title={item.name}
                description={item.chartType ? ('图表类型' + item.chartType) : undefined}
              />
              <p>{'分析目标' + item.goal}</p>

              <div className="margin-16" />
              <ReactECharts option={JSON.parse(item.genChart ?? '{}')} />
            </Card>
          </List.Item>
        )}
      />
      总数: {
      total
    }
    </div>
  );
};



export default MyChart;
