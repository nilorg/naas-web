import React, { useEffect } from 'react';
import { Form, Button, Input, Modal, Select } from 'antd';
import { RemoteSelect } from '@/components/form';
import { getById } from '../service';

export interface EditFormProps {
  id?: string;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  modalVisible: boolean;
}

const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 13 },
};

const EditForm: React.FC<EditFormProps> = (props) => {
  const [form] = Form.useForm();

  const { onSubmit, onCancel, modalVisible } = props;
  useEffect(() => {
    if (modalVisible && props.id) {
      getById(props.id).then((expr) => {
        if (expr.status === 'ok') {
          form.setFieldsValue(expr.data);
        }
      });
    } else {
      form.resetFields();
    }
  }, [modalVisible]);
  const handleComplete = async () => {
    const fieldsValue = await form.validateFields();
    onSubmit({
      id: props.id,
      ...fieldsValue,
    });
  };

  const renderFooter = () => (
    <>
      <Button onClick={onCancel}>取消</Button>
      <Button type="primary" onClick={handleComplete}>
        完成
      </Button>
    </>
  );

  return (
    <Modal
      destroyOnClose
      maskClosable={false}
      title={`${props.id ? '编辑' : '添加'}Web路由`}
      visible={modalVisible}
      onCancel={onCancel}
      afterClose={onCancel}
      footer={renderFooter()}
    >
      <Form {...formLayout} form={form}>
        <Form.Item label="名称" name="name" rules={[{ required: true, message: '请输入名称' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="路由地址" name="path" rules={[{ required: true, message: '请输入路由' }]}>
          <Input />
        </Form.Item>
        <Form.Item
          label="请求方法"
          name="method"
          rules={[{ required: true, message: '请选择请求方法' }]}
        >
          <Select>
            <Select.Option key="GET" value="GET">
              GET
            </Select.Option>
            <Select.Option key="POST" value="POST">
              POST
            </Select.Option>
            <Select.Option key="PUT" value="PUT">
              PUT
            </Select.Option>
            <Select.Option key="DELETE" value="DELETE">
              DELETE
            </Select.Option>
            <Select.Option key="OPTIONS" value="OPTIONS">
              OPTIONS
            </Select.Option>
            <Select.Option key="TRACE" value="TRACE">
              TRACE
            </Select.Option>
            <Select.Option key="CONNECT" value="CONNECT">
              CONNECT
            </Select.Option>
            <Select.Option key="HEAD" value="HEAD">
              HEAD
            </Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="资源服务器"
          name="resource_server_id"
          rules={[{ required: true, message: '请选资源服务器', type: 'number' }]}
        >
          <RemoteSelect type="resource_server" placeholder="选择资源服务器" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditForm;
