import React from 'react';
import { Modal } from 'antd';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const { confirm } = Modal;

const removeConfirm = (props: {
  name: string;
  count?: number;
  onOk: (...args: any[]) => any;
  onCancel?: (...args: any[]) => any;
}) => {
  confirm({
    title: '删除提醒',
    icon: <ExclamationCircleOutlined />,
    content: `您确定要删除${props.count && props.count > 1 ? props.count : '这'}项${
      props.name
    }吗？`,
    okText: '确定',
    okType: 'primary',
    cancelText: '取消',
    onOk: props.onOk,
    onCancel: props.onCancel,
  });
};

export { removeConfirm };
