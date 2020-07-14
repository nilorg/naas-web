import React, { useEffect } from 'react';
import { Form, Button, Input, Modal } from 'antd';
import { UploadAvatar } from '@/components/form';
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
      title={`${props.id ? '编辑' : '添加'}OAuth2客户端`}
      visible={modalVisible}
      onCancel={onCancel}
      afterClose={onCancel}
      footer={renderFooter()}
    >
      <Form {...formLayout} form={form}>
        <Form.Item label="名称" name="name" rules={[{ required: true, message: '请输入名称' }]}>
          <Input />
        </Form.Item>
        <Form.Item
          label="描述"
          name="description"
          rules={[{ required: true, message: '请输入描述' }]}
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item label="Logo" name="profile" rules={[{ required: true, message: '请上传logo' }]}>
          <UploadAvatar />
        </Form.Item>
        <Form.Item
          label="回调地址"
          name="redirect_uri"
          rules={[{ required: true, message: '请输入回调地址' }]}
        >
          <Input.TextArea />
        </Form.Item>
        <Form.Item label="网站" name="website" rules={[{ required: false, message: '请输入网站' }]}>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditForm;
