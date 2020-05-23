import React, { useState, useEffect } from 'react';
import { Form, Button, Input, Modal } from 'antd';
import moment from 'moment';
import { nextCronExpr, getExpr } from '../service';

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
  const [cronNextExpr, setCronNextExpr] = useState<Array<string>>([]);
  const { onSubmit, onCancel, modalVisible } = props;
  useEffect(() => {
    if (modalVisible && props.id) {
      getExpr(props.id).then((expr) => {
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
  const handleExprBlur = async (v: string) => {
    const result = await nextCronExpr(v);
    if (result.status === 'ok') {
      setCronNextExpr(result.data);
    } else {
      setCronNextExpr([]);
    }
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
      title="编辑表达式"
      visible={modalVisible}
      onCancel={onCancel}
      afterClose={onCancel}
      footer={renderFooter()}
    >
      <Form {...formLayout} form={form}>
        <Form.Item
          label="名称"
          name="name"
          rules={[{ required: true, message: '请输入表达式名称' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="表达式" name="expr" rules={[{ required: true, message: '请输入表达式' }]}>
          <Input
            onBlur={(e) => {
              handleExprBlur(e.target.value);
            }}
          />
        </Form.Item>
        <div>
          下次执行时间:
          {cronNextExpr?.map((item, itemIndex) => {
            return <p key={itemIndex}>{moment(item).format('YYYY-MM-DD HH:mm:ss')}</p>;
          })}
        </div>
        <Form.Item
          label="说明"
          name="description"
          rules={[{ required: false, message: '请输入表达式说明' }]}
        >
          <Input.TextArea />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditForm;
