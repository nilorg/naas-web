import React, { useEffect } from 'react';
import { Form, Button, Modal } from 'antd';
import { RemoteOrganizationTree } from '@/components/form';
import { getOrganizationByUserId } from '../service';

export interface EditOrganizationFormProps {
  userId?: string;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  modalVisible: boolean;
}

const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 13 },
};

const EditOrganizationForm: React.FC<EditOrganizationFormProps> = (props) => {
  const [form] = Form.useForm();

  const { onSubmit, onCancel, modalVisible, userId } = props;

  const loadOrganizations = async (uid: string) => {
    const result = await getOrganizationByUserId(uid);
    if (result.status === 'ok') {
      const data = result.data || [];
      const orgs = [];
      for (let i = 0; i < data.length; i += 1) {
        orgs.push(data[i].id);
      }
      form.setFieldsValue({
        organizations: orgs,
      });
    } else {
      form.setFieldsValue({
        organizations: [],
      });
    }
  };

  useEffect(() => {
    if (userId) {
      loadOrganizations(userId);
    }
  }, [userId]);

  const handleComplete = async () => {
    const fieldsValue = await form.validateFields();
    onSubmit({
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
      title="编辑组织"
      visible={modalVisible}
      onCancel={onCancel}
      afterClose={onCancel}
      footer={renderFooter()}
    >
      <Form {...formLayout} form={form}>
        <Form.Item
          label="组织"
          name="organizations"
          rules={[{ required: true, message: '请选择角色', type: 'array' }]}
        >
          <RemoteOrganizationTree />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditOrganizationForm;
