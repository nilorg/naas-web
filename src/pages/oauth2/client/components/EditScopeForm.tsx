import React, { useEffect } from 'react';
import { Form, Button, Modal } from 'antd';
import { RemoteSelect2 } from '@/components/form';
import { getClientScopeByClientId } from '../service';

export interface EditScopeFormProps {
  clientId?: string;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  modalVisible: boolean;
}

const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 13 },
};

const EditScopeForm: React.FC<EditScopeFormProps> = (props) => {
  const [form] = Form.useForm();

  const { onSubmit, onCancel, modalVisible, clientId } = props;

  const loadClientScopes = async (cid: string) => {
    const result = await getClientScopeByClientId(cid);
    if (result.status === 'ok') {
      const data = result.data || [];
      const scopes = [];
      for (let i = 0; i < data.length; i += 1) {
        scopes.push(data[i].scope_code);
      }
      form.setFieldsValue({
        scopes,
      });
    } else {
      form.setFieldsValue({
        scopes: [],
      });
    }
  };

  useEffect(() => {
    if (clientId) {
      loadClientScopes(clientId);
    }
  }, [clientId]);

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
      title="编辑范围"
      visible={modalVisible}
      onCancel={onCancel}
      afterClose={onCancel}
      footer={renderFooter()}
    >
      <Form {...formLayout} form={form}>
        <Form.Item
          label="范围"
          name="scopes"
          rules={[{ required: true, message: '请选择范围', type: 'array' }]}
        >
          <RemoteSelect2 type="oauth2_scope" placeholder="请选择范围" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditScopeForm;
