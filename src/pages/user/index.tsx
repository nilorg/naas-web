import React, { useState, useRef } from 'react';
import { Button, Dropdown, Menu, message } from 'antd';
import { DownOutlined, PlusOutlined, DeleteFilled, EditFilled } from '@ant-design/icons';
import ProTable, { ProColumns, ActionType, RequestData } from '@ant-design/pro-table';
import { UseFetchDataAction } from '@ant-design/pro-table/lib/useFetchData';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { SorterResult } from 'antd/es/table/interface';

import { removeConfirm } from '@/components/modal';
import EditForm from './components/EditForm';
import { query, edit, remove } from './service';

/**
 * 编辑节点
 * @param fields
 */
const handleEdit = async (fields: any) => {
  const hide = message.loading('正在保存');
  try {
    const resp = await edit(fields);
    hide();
    if (resp.status === 'error') {
      message.error(`保存失败:${resp.error}`);
      return false;
    }
    message.success('保存成功');
    return true;
  } catch (error) {
    hide();
    message.error('修改失败请重试！');
    return false;
  }
};

/**
 *  删除节点
 * @param selectedRows
 */
const handleRemove = async (action: UseFetchDataAction<RequestData<any>>, selectedRows: any[]) => {
  removeConfirm({
    name: 'Cron表达式',
    count: selectedRows.length,
    onOk: async () => {
      const hide = message.loading('正在删除');
      if (!selectedRows) return true;
      try {
        const result = await remove({
          ids: selectedRows.map((row) => row.user_id),
        });
        hide();
        if (result.code === 1) {
          message.success('删除成功，即将刷新');
          action.reload();
          return true;
        }
        message.error('删除失败');
        return false;
      } catch (error) {
        hide();
        message.error('删除失败，请重试');
        return false;
      }
    },
  });
};

const TableList: React.FC<{}> = () => {
  // const { data: treeCodeData } = useRequest(() =>
  //   getTreeData({
  //     type: 'code',
  //   }),
  // );
  const [sorter, setSorter] = useState<string>('');
  const [editModalVisible, setEditModalVisible] = useState<boolean>(false);
  const [editId, setEditId] = useState<string>();
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<any>[] = [
    {
      title: '用户名',
      dataIndex: 'username',
    },
    {
      title: '昵称',
      dataIndex: 'nickname',
      hideInSearch: true,
    },
    {
      title: '头像',
      dataIndex: 'picture',
      hideInSearch: true,
      render: (_, record: any) => {
        // eslint-disable-next-line jsx-a11y/alt-text
        return <img width={48} height={48} src={record.picture} />;
      },
    },
    {
      title: '手机号',
      dataIndex: 'phone',
    },
    {
      title: '手机号验证',
      dataIndex: 'phone_verified',
      hideInSearch: true,
      renderText: (val: boolean) => (val ? '已验证' : '未验证'),
    },
    {
      title: '邮箱',
      dataIndex: 'email',
    },
    {
      title: '邮箱验证',
      dataIndex: 'email_verified',
      hideInSearch: true,
      renderText: (val: boolean) => (val ? '已验证' : '未验证'),
    },
  ];

  return (
    <PageHeaderWrapper title={false}>
      <ProTable<any>
        actionRef={actionRef}
        rowKey="user_id"
        onChange={(_, _filter, _sorter) => {
          const sorterResult = _sorter as SorterResult<any>;
          if (sorterResult.field) {
            setSorter(`${sorterResult.field}_${sorterResult.order}`);
          }
        }}
        params={{
          sorter,
        }}
        toolBarRender={(action, { selectedRows }) => [
          <Button type="primary" onClick={() => setEditModalVisible(true)}>
            <PlusOutlined /> 新建
          </Button>,
          selectedRows && selectedRows.length > 1 && (
            <Dropdown
              overlay={
                <Menu
                  onClick={(e) => {
                    if (e.key === 'remove') {
                      handleRemove(action, selectedRows);
                    }
                  }}
                  selectedKeys={[]}
                >
                  <Menu.Item key="remove">批量删除</Menu.Item>
                </Menu>
              }
            >
              <Button>
                批量操作 <DownOutlined />
              </Button>
            </Dropdown>
          ),
          selectedRows && selectedRows.length === 1 && (
            <Button
              type="default"
              onClick={() => {
                setEditId(selectedRows[0].user_id);
                setEditModalVisible(true);
              }}
            >
              <EditFilled /> 编辑
            </Button>
          ),
          selectedRows && selectedRows.length === 1 && (
            <Button type="primary" danger onClick={() => handleRemove(action, selectedRows)}>
              <DeleteFilled /> 删除
            </Button>
          ),
        ]}
        tableAlertRender={() => false}
        request={(params) => query(params)}
        columns={columns}
        rowSelection={{}}
        options={{ fullScreen: false, reload: false, setting: false, density: false }}
        className="table"
      />
      <EditForm
        onSubmit={async (value) => {
          const success = await handleEdit(value);
          if (success) {
            setEditId(undefined);
            setEditModalVisible(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => {
          setEditId(undefined);
          setEditModalVisible(false);
        }}
        modalVisible={editModalVisible}
        id={editId}
      />
    </PageHeaderWrapper>
  );
};

export default TableList;
