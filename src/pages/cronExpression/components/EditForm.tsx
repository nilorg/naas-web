import React, { useState, useEffect } from 'react';
import { Form, Button, TreeSelect, Input, Modal, Select } from 'antd';
import { getTreeData } from '../service';

export interface EditFormValueType {
  id?: string;
  name?: string;
  code?: string;
  parentCode?: string;
  status?: string;
}

export interface EditFormProps {
  onCancel: () => void;
  onSubmit: (values: EditFormValueType) => void;
  modalVisible: boolean;
  values: EditFormValueType;
}

const formLayout = {
  labelCol: { span: 7 },
  wrapperCol: { span: 13 },
};

const EditForm: React.FC<EditFormProps> = (props) => {
  const [treeData, setTreeData] = useState([]);
  useEffect(() => {
    getTreeData({
      type: 'id',
    }).then((data) => setTreeData(data));
  }, []);

  const [form] = Form.useForm();

  const { onSubmit, onCancel, modalVisible: updateModalVisible, values } = props;

  const handleNext = async () => {
    const fieldsValue = await form.validateFields();
    onSubmit({
      id: values.id,
      ...fieldsValue,
    });
  };

  const renderFooter = () => (
    <>
      <Button onClick={() => onCancel}>取消</Button>
      <Button type="primary" onClick={() => handleNext()}>
        完成
      </Button>
    </>
  );

  return (
    <Modal
      destroyOnClose
      title="编辑栏目"
      visible={updateModalVisible}
      onCancel={onCancel}
      afterClose={onCancel}
      footer={renderFooter()}
    >
      <Form {...formLayout} form={form} initialValues={values}>
        <Form.Item
          label="栏目名称"
          name="name"
          rules={[{ required: true, message: '请输入栏目名称' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="编号" name="code" rules={[{ required: true, message: '请输入栏目编号' }]}>
          <Input />
        </Form.Item>

        <Form.Item
          label="上级栏目"
          name="parentCode"
          rules={[{ required: false, message: '请选择上级栏目' }]}
        >
          <TreeSelect treeData={treeData} placeholder="选择上级栏目" treeDefaultExpandAll />
        </Form.Item>
        <Form.Item
          label="状态"
          name="enabled"
          rules={[{ required: true, message: '请选择栏目状态' }]}
        >
          <Select>
            <Select.Option value="0">未发布</Select.Option>
            <Select.Option value="1">已发布</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditForm;
