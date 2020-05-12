import React, { useState, useEffect } from 'react';
import { Button, Input, Modal, Radio, Select, Steps, Form } from 'antd';

export interface FormValueType {
  id?: string;
  name?: string;
  desc?: string;
  sync?: boolean | number;
  type?: string;
  cron_expr?: string;
  detail?: any;
}

export interface EditFormProps {
  onCancel: () => void;
  onSubmit: (values: FormValueType) => void;
  updateModalVisible: boolean;
  id?: string;
}
const FormItem = Form.Item;
const { Step } = Steps;
const { TextArea } = Input;
const { Option } = Select;
const RadioGroup = Radio.Group;

export interface UpdateFormState {
  formVals: FormValueType;
  currentStep: number;
}

const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 13 },
};

const EditForm: React.FC<EditFormProps> = (props) => {
  const { onSubmit, onCancel, updateModalVisible, id } = props;
  const [formVals, setFormVals] = useState<FormValueType>({});
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [type, setType] = useState<string>('0');
  const [form] = Form.useForm();

  useEffect(() => {
    if (id) {
      console.log('修改查询数据');
    } else {
      console.log('添加数据');
      setFormVals({
        sync: 1,
        type: '0',
        detail: {
          arg: '-c',
          interpreter: '/bin/bash',
        },
      });
    }
  }, [id]);

  const forward = () => setCurrentStep(currentStep + 1);

  const backward = () => setCurrentStep(currentStep - 1);

  const handleNext = async () => {
    const fieldsValue = await form.validateFields();
    const newformVals = { ...formVals, ...fieldsValue };
    setFormVals(newformVals);
    if (currentStep < 2) {
      forward();
    } else {
      onSubmit(newformVals);
    }
  };

  const renderContent = () => {
    if (currentStep === 1) {
      return (
        <>
          <FormItem name="sync" label="是否同步">
            <RadioGroup>
              <Radio value={0}>否</Radio>
              <Radio value={1}>是</Radio>
            </RadioGroup>
          </FormItem>
          <FormItem name="type" label="任务类型">
            <Select onChange={(e: string) => setType(e)} style={{ width: '100%' }}>
              <Option value="0">SHELL</Option>
              <Option value="1">HTTP</Option>
              <Option value="2">HTTPS</Option>
              <Option value="3">gRpc</Option>
              <Option value="4">GoRpc</Option>
            </Select>
          </FormItem>
          {type === '0' ? (
            <>
              <FormItem
                name={['detail', 'arg']}
                label="参数"
                rules={[{ required: true, message: '请输入参数' }]}
              >
                <Input />
              </FormItem>
              <FormItem
                name={['detail', 'interpreter']}
                label="解析器"
                rules={[{ required: true, message: '请输入解析器' }]}
              >
                <Input />
              </FormItem>
              <FormItem
                name={['detail', 'command']}
                label="脚本"
                rules={[{ required: true, message: '请输入脚本' }]}
              >
                <Input.TextArea />
              </FormItem>
            </>
          ) : null}
          {type === '1' || type === '2' ? (
            <>
              <FormItem
                name={['detail', 'method']}
                label="请求方法"
                rules={[{ required: true, message: '请选择请求方法' }]}
              >
                <Select style={{ width: '100%' }}>
                  <Option value="GET">GET</Option>
                  <Option value="POST">POST</Option>
                  <Option value="PUT">PUT</Option>
                  <Option value="DELETE">DELETE</Option>
                </Select>
              </FormItem>
              <FormItem
                name={['detail', 'url']}
                label="URL"
                rules={[{ required: true, message: '请输入URL' }]}
              >
                <Input />
              </FormItem>
              <FormItem
                name={['detail', 'headers']}
                label="Headers"
                rules={[{ required: true, message: '请输入请求头' }]}
              >
                <Input.TextArea />
              </FormItem>
              <FormItem
                name={['detail', 'body']}
                label="Body"
                rules={[{ required: false, message: '请输入请求附带的值' }]}
              >
                <Input.TextArea />
              </FormItem>
            </>
          ) : null}
          {type === '3' || type === '4' ? (
            <>
              <FormItem
                name={['detail', 'address']}
                label="地址"
                rules={[{ required: true, message: '请输入地址' }]}
              >
                <Input />
              </FormItem>
              <FormItem
                name={['detail', 'task_id']}
                label="任务ID"
                rules={[{ required: true, message: '请输入任务ID' }]}
              >
                <Input.TextArea />
              </FormItem>
              <FormItem
                name={['detail', 'body']}
                label="Body"
                rules={[{ required: false, message: '请输入请求任务附带的值' }]}
              >
                <Input.TextArea />
              </FormItem>
            </>
          ) : null}
        </>
      );
    }
    if (currentStep === 2) {
      return (
        <>
          <FormItem
            name="cron_expr"
            label="Cron表达式"
            rules={[{ required: true, message: '请输入Cron表达式' }]}
          >
            <Select>
              <Select.Option value="*/10 * * * * *">每10s执行一次</Select.Option>
            </Select>
          </FormItem>
        </>
      );
    }
    return (
      <>
        <FormItem
          name="name"
          label="任务名称"
          rules={[{ required: true, message: '请输入任务名称！' }]}
        >
          <Input placeholder="请输入" />
        </FormItem>
        <FormItem
          name="desc"
          label="任务描述"
          rules={[{ required: true, message: '请输入至少五个字符的任务描述！', min: 5 }]}
        >
          <TextArea rows={4} placeholder="请输入至少五个字符" />
        </FormItem>
      </>
    );
  };

  const renderFooter = () => {
    if (currentStep === 1) {
      return (
        <>
          <Button style={{ float: 'left' }} onClick={backward}>
            上一步
          </Button>
          <Button onClick={onCancel}>取消</Button>
          <Button type="primary" onClick={() => handleNext()}>
            下一步
          </Button>
        </>
      );
    }
    if (currentStep === 2) {
      return (
        <>
          <Button style={{ float: 'left' }} onClick={backward}>
            上一步
          </Button>
          <Button onClick={onCancel}>取消</Button>
          <Button type="primary" onClick={() => handleNext()}>
            完成
          </Button>
        </>
      );
    }
    return (
      <>
        <Button onClick={onCancel}>取消</Button>
        <Button type="primary" onClick={() => handleNext()}>
          下一步
        </Button>
      </>
    );
  };

  return (
    <Modal
      width={640}
      bodyStyle={{ padding: '32px 40px 48px' }}
      destroyOnClose
      title="任务配置"
      visible={updateModalVisible}
      footer={renderFooter()}
      onCancel={onCancel}
      afterClose={onCancel}
    >
      <Steps style={{ marginBottom: 28 }} size="small" current={currentStep}>
        <Step title="基本信息" />
        <Step title="配置任务属性" />
        <Step title="设定调度周期" />
      </Steps>
      <Form
        {...formLayout}
        form={form}
        initialValues={{
          name: formVals.name,
          desc: formVals.desc,
          sync: formVals.sync,
          type: formVals.type,
          detail: formVals.detail,
        }}
      >
        {renderContent()}
      </Form>
    </Modal>
  );
};

export default EditForm;
