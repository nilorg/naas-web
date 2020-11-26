import React, { useEffect } from 'react';
import { Form, Button, Input, Modal } from 'antd';
import { RemoteSearchSelect } from '@/components/form';
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
          if (expr.data.resource_server_id) {
            form.setFieldsValue({
              ...expr.data,
              resource_server_id: expr.data.resource_server_id,
            });
          }
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
      title={`${props.id ? '编辑' : '添加'}动作`}
      visible={modalVisible}
      onCancel={onCancel}
      afterClose={onCancel}
      footer={renderFooter()}
    >
      <Form {...formLayout} form={form}>
        <Form.Item
          label="资源服务器"
          name="resource_server_id"
          rules={[{ required: true, message: '请选资源服务器', type: 'number' }]}
        >
          <RemoteSearchSelect noData={0} type="resource_server" placeholder="选择资源服务器" />
        </Form.Item>
        <Form.Item label="分组" name="group" rules={[{ required: true, message: '请输入分组' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="CODE" name="code" rules={[{ required: true, message: '请输入CODE' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="名称" name="name" rules={[{ required: true, message: '请输入名称' }]}>
          <Input />
        </Form.Item>
        <Form.Item
          label="介绍"
          name="description"
          rules={[{ required: false, message: '请输入介绍' }]}
        >
          <Input.TextArea />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditForm;
