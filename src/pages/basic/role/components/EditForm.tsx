import React, { useEffect, useState } from 'react';
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
  const [organizationId, setOrganizationId] = useState<number>(0);

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
      title={`${props.id ? '编辑' : '添加'}角色`}
      visible={modalVisible}
      onCancel={onCancel}
      afterClose={onCancel}
      footer={renderFooter()}
    >
      <Form
        {...formLayout}
        onValuesChange={(changedValues: any) => {
          if (changedValues.organization_id) {
            setOrganizationId(changedValues.organization_id);
          } else {
            setOrganizationId(0);
          }
        }}
        form={form}
      >
        <Form.Item
          label="组织"
          name="organization_id"
          rules={[{ required: true, message: '请选择组织', type: 'number' }]}
        >
          <RemoteSearchSelect
            noData={0}
            type="organization"
            disabled={!!props.id}
            placeholder="选择组织"
          />
        </Form.Item>
        <Form.Item
          label="角色CODE"
          name="code"
          rules={[{ required: true, message: '请输入角色CODE' }]}
        >
          <Input disabled={!!props.id} />
        </Form.Item>
        <Form.Item
          label="角色名称"
          name="name"
          rules={[{ required: true, message: '请输入角色名称' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="角色描述" name="description" rules={[{ message: '请输入角色描述' }]}>
          <Input.TextArea />
        </Form.Item>
        <Form.Item
          label="上级角色"
          name="parent_code"
          rules={[{ required: false, message: '请选择角色', type: 'string' }]}
        >
          <RemoteSearchSelect
            noData=""
            organizationId={organizationId}
            type="role"
            placeholder="选择角色"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditForm;
