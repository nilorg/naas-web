import React, { useEffect, useState } from 'react';
import { Form, Button, Input, Modal, InputNumber, TreeSelect, Select } from 'antd';
import { RemoteSearchSelect } from '@/components/form';
import { getById, queryTreeForResourceWebMenu } from '../service';

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
  const [parentTreeData, setParentTreeData] = useState<any[]>([]);
  const [resourceServerId, setResourceServerId] = useState<number>();

  const { onSubmit, onCancel, modalVisible } = props;

  useEffect(() => {
    if (modalVisible && props.id) {
      getById(props.id).then((expr) => {
        if (expr.status === 'ok') {
          if (expr.data.resource_server_id) {
            setResourceServerId(expr.data.resource_server_id);
          }
          form.setFieldsValue({
            ...expr.data,
            leaf: expr.data.leaf ? 1 : 0,
          });
        }
      });
    } else {
      form.resetFields();
    }
  }, [modalVisible]);

  const loadTree = async (sid: number) => {
    const result = await queryTreeForResourceWebMenu(sid);
    if (result.status === 'ok') {
      setParentTreeData(result.data || []);
    } else {
      setParentTreeData([]);
    }
  };

  useEffect(() => {
    if (resourceServerId) {
      loadTree(resourceServerId);
    }
  }, [resourceServerId]);

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
      title={`${props.id ? '编辑' : '添加'}Web菜单`}
      visible={modalVisible}
      onCancel={onCancel}
      afterClose={onCancel}
      footer={renderFooter()}
    >
      <Form
        {...formLayout}
        onValuesChange={(v: any) => {
          if (v.resource_server_id) {
            setResourceServerId(v.resource_server_id);
          }
        }}
        form={form}
      >
        <Form.Item
          label="资源服务器"
          name="resource_server_id"
          rules={[{ required: true, message: '请选资源服务器', type: 'number' }]}
        >
          <RemoteSearchSelect noData={0} type="resource_server" placeholder="选择资源服务器" />
        </Form.Item>

        <Form.Item label="名称" name="name" rules={[{ required: true, message: '请输入名称' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="地址" name="url" rules={[{ required: false, message: '请输入地址' }]}>
          <Input.TextArea />
        </Form.Item>
        <Form.Item label="图标" name="icon" rules={[{ required: false, message: '图标（可选）' }]}>
          <Input />
        </Form.Item>
        <Form.Item
          label="是否叶子菜单"
          name="leaf"
          rules={[{ required: true, message: '请选择是否叶子菜单' }]}
        >
          <Select>
            <Select.Option key={0} value={0}>
              否
            </Select.Option>
            <Select.Option key={0} value={1}>
              是
            </Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          label="序列号"
          name="serial_number"
          rules={[{ required: false, message: '排序编号' }]}
          initialValue={1}
        >
          <InputNumber style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          label="父级菜单"
          name="parent_id"
          rules={[{ required: false, message: '请选择是否父级菜单' }]}
        >
          <TreeSelect
            showSearch
            treeNodeFilterProp="label"
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            treeData={parentTreeData}
            placeholder="请选择"
            treeDefaultExpandAll
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditForm;
