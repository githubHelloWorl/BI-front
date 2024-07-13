import React, {useEffect, useState} from "react";
import {genChartByAiUsingPost, listChartByPageUsingPost} from "@/services/BI/chartController";
import {Button, Card, Col, Divider, Form, Input, message, Row, Select, Space, Spin, Upload} from "antd";
import TextArea from "antd/es/input/TextArea";
import {UploadOutlined} from "@ant-design/icons";
import ReactECharts from 'echarts-for-react';
import {useForm} from "rc-field-form";

/**
 * 添加图表(异步)页面
 * @constructor
 */
const AddChartAsync: React.FC = () => {
  const [form] = useForm();
  const [submitting, setSubmitting] = useState<boolean>(false);

// 使用JSON.stringify()将对象转换为JSON字符串

  /**
   * 提交
   * @param values
   */
  const onFinish = async (values: any) => {
    // 避免重复提交
    if (submitting) {
      return;
    }
    setSubmitting(true);
    // TODO 对接后端,上传数据
    const params = {
      ...values,
      file: undefined
    };

    try {
      const res = await genChartByAiUsingPost(params, {}, values.file.file.originFileObj);
      if (!res?.data) {
        message.error('分析失败', 1)
      } else {
        message.success('分析任务提交成功,稍后再我的图表中查看', 1)
        form.resetFields();
      }

    } catch (e: any) {
      console.log("抛出错误", e.message);
      message.error('分析失败', 1)
      // message.error('分析失败2', 1, e.message)
    }
    setSubmitting(false);
  };

  return (
    <div className="add-chart-async">
      <Row gutter={24}>
        <Col span={12}>
          <Card title="智能分析">
            <Form
              form={form}
              name="addChart"
              onFinish={onFinish}
              initialValues={{}}
              labelAlign="left"
              labelCol={{span: 4}}
              wrapperCol={{span: 16}}
            >
              <Form.Item name="goal" label="分析目标" rules={[{required: true, message: '请输入分析目标'}]}>
                <TextArea placeholder="请输入你的分析祈求。比如: 分析网站用户的增长情况"/>
              </Form.Item>

              <Form.Item name="name" label="图表名称" rules={[{required: true, message: '请输入图表名称'}]}>
                <Input placeholder="请输入图表名称"/>
              </Form.Item>

              <Form.Item
                name="chartType"
                label="图表类型"
              >
                <Select options={[
                  {value: '折线图', label: '折线图'},
                  {value: '柱状图', label: '柱状图'},
                  {value: '堆叠图', label: '堆叠图'},
                  {value: '饼图', label: '饼图'},
                  {value: '雷达图', label: '雷达图'}
                ]}/>
              </Form.Item>

              <Form.Item
                name="file"
                label="原始数据"
                rules={[{required: true, message: '请输入分析数据(需要xlsx)'}]}
              >
                <Upload name="file" maxCount={1}>
                  <Button icon={<UploadOutlined/>}>上传 CVS 文件</Button>
                </Upload>
              </Form.Item>

              <Form.Item wrapperCol={{span: 16, offset: 4}}>
                <Space>
                  <Button type="primary" loading={submitting} disabled={submitting} htmlType="submit">
                    提交
                  </Button>
                  <Button htmlType="reset">重置</Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AddChartAsync;
