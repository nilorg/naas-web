import React, { useEffect } from 'react';
import { Form, Button, Input, Modal } from 'antd';
import { OrgRemoteSelect } from '@/components/form';
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
      title={`${props.id ? '编辑' : '添加'}组织`}
      visible={modalVisible}
      onCancel={onCancel}
      afterClose={onCancel}
      footer={renderFooter()}
    >
      <Form {...formLayout} form={form}>
        <Form.Item
          label="组织名称"
          name="name"
          rules={[{ required: true, message: '请输入用户名' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="组织CODE"
          name="code"
          rules={[{ required: true, message: '请输入用户名' }]}
        >
          <Input disabled={props.id !== undefined} />
        </Form.Item>
        <Form.Item label="组织描述" name="description" rules={[{ message: '请输入密码' }]}>
          <Input.TextArea />
        </Form.Item>
        <Form.Item
          label="上级组织"
          name="parent_id"
          rules={[{ message: '请选择上级组织', type: 'number' }]}
        >
          <OrgRemoteSelect />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditForm;
