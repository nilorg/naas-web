import React, { useEffect, useState } from 'react';
import { Form } from 'antd';
import { RemoteSearchSelect } from '@/components/form';
import RemoteRoleTree from './RemoteRoleTree';

export interface OrganizationRoleProps {
  onChange: (values: any) => void;
}

const OrganizationRole: React.FC<OrganizationRoleProps> = (props) => {
  const [form] = Form.useForm();
  const [organizationId, setOrganizationId] = useState<number>(0);
  useEffect(() => {
    if (organizationId === 0) {
      form.setFieldsValue({
        roles: [],
      });
    }
  }, [organizationId]);
  return (
    <Form
      form={form}
      onValuesChange={(_, allValues) => {
        props.onChange(allValues);
      }}
    >
      <Form.Item
        label="组织"
        name="organization_id"
        rules={[{ required: true, message: '请选择组织', type: 'number' }]}
      >
        <RemoteSearchSelect
          noData={0}
          type="organization"
          placeholder="请选择组织"
          onChange={setOrganizationId}
        />
      </Form.Item>
      <Form.Item
        label="角色"
        name="roles"
        rules={[{ required: true, message: '请选择角色', type: 'array' }]}
      >
        <RemoteRoleTree organizationId={organizationId} />
      </Form.Item>
    </Form>
  );
};

export default OrganizationRole;
