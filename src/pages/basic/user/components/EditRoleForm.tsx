import React, { useEffect, useState } from 'react';
import { Form, Button, Modal, Select } from 'antd';
import { RemoteRoleTree } from '@/components/form';
import { getOrganizationByUserId, getRolesByUserIdAndOrganizationId } from '../service';

export interface EditRoleFormProps {
  userId?: string;
  onCancel: () => void;
  onSubmit: (values: any) => void;
  modalVisible: boolean;
}

const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 13 },
};

const EditRoleForm: React.FC<EditRoleFormProps> = (props) => {
  const [form] = Form.useForm();
  const [organizationId, setOrganizationId] = useState<number>(0);

  const [organizationList, setOrganizationList] = useState<any[]>([]);

  const { onSubmit, onCancel, modalVisible, userId } = props;

  const loadOrganizations = async (uid: string) => {
    const result = await getOrganizationByUserId(uid);
    if (result.status === 'ok') {
      setOrganizationList(result.data || []);
    } else {
      setOrganizationList([]);
    }
  };

  useEffect(() => {
    if (userId) {
      loadOrganizations(userId);
    }
  }, [userId]);

  const loadRoles = async (uid: string, orgId: number) => {
    const result = await getRolesByUserIdAndOrganizationId(uid, orgId);
    if (result.status === 'ok') {
      const data = result.data || [];
      const roles = [];
      for (let i = 0; i < data.length; i += 1) {
        roles.push(data[i].code);
      }
      form.setFieldsValue({
        roles,
      });
    } else {
      form.setFieldsValue({
        roles: [],
      });
    }
  };

  useEffect(() => {
    if (userId && organizationId) {
      loadRoles(userId, organizationId);
    }
  }, [userId, organizationId]);

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
      title="编辑角色"
      visible={modalVisible}
      onCancel={onCancel}
      afterClose={onCancel}
      footer={renderFooter()}
    >
      <Form {...formLayout} form={form}>
        <Form.Item
          label="组织"
          name="organization_id"
          rules={[{ required: true, message: '请选择组织', type: 'number' }]}
        >
          <Select
            placeholder="请选择组织"
            filterOption={false}
            style={{ width: '100%' }}
            onChange={(id: number) => {
              setOrganizationId(id);
            }}
          >
            <Select.Option key={0} value={0}>
              无
            </Select.Option>
            {organizationList.map((d: any) => (
              <Select.Option key={d.id} value={d.id}>
                {d.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="角色"
          name="roles"
          rules={[{ required: false, message: '请选择角色', type: 'array' }]}
        >
          <RemoteRoleTree organizationId={organizationId} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditRoleForm;
