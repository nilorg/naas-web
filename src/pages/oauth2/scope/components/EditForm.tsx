import React, { useEffect } from 'react';
import { Form, Button, Input, Modal, Select } from 'antd';
import { getByCode } from '../service';

export interface EditFormProps {
  code?: string;
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
    if (modalVisible && props.code) {
      getByCode(props.code).then((expr) => {
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
      code: props.code,
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
      title={`${props.code ? '编辑' : '添加'}OAuth2范围`}
      visible={modalVisible}
      onCancel={onCancel}
      afterClose={onCancel}
      footer={renderFooter()}
    >
      <Form {...formLayout} form={form}>
        {props.code ? null : (
          <Form.Item label="CODE" name="code" rules={[{ required: true, message: '请输入CODE' }]}>
            <Input />
          </Form.Item>
        )}
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
        <Form.Item label="类型" name="type" rules={[{ required: false, message: '请选择类型' }]}>
          <Select style={{ width: '100%' }}>
            <Select.Option value="basic">基础</Select.Option>
            <Select.Option value="default">默认</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditForm;
