import React, { useState, useRef } from 'react';
import { Button, Dropdown, Menu, message } from 'antd';
import { DownOutlined, PlusOutlined, DeleteFilled, EditFilled } from '@ant-design/icons';
import ProTable, { ProColumns, ActionType, RequestData } from '@ant-design/pro-table';
import { UseFetchDataAction } from '@ant-design/pro-table/lib/useFetchData';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { SorterResult } from 'antd/es/table/interface';

import { removeConfirm } from '@/components/modal';
import EditForm from './components/EditForm';
import { TableListItem } from './data';
import { queryExpr, editExpr, removeExpr } from './service';

/**
 * 编辑节点
 * @param fields
 */
const handleEdit = async (fields: any) => {
  const hide = message.loading('正在保存');
  try {
    const resp = await editExpr(fields);
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
const handleRemove = async (
  action: UseFetchDataAction<RequestData<TableListItem>>,
  selectedRows: TableListItem[],
) => {
  removeConfirm({
    name: 'Cron表达式',
    count: selectedRows.length,
    onOk: async () => {
      const hide = message.loading('正在删除');
      if (!selectedRows) return true;
      try {
        const result = await removeExpr({
          ids: selectedRows.map((row) => row.id),
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
  const [exprId, setExprId] = useState<string>();
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '表达式',
      dataIndex: 'expr',
    },
    {
      title: '描述',
      dataIndex: 'description',
    },
  ];

  return (
    <PageHeaderWrapper title={false}>
      <ProTable<TableListItem>
        actionRef={actionRef}
        rowKey="id"
        onChange={(_, _filter, _sorter) => {
          const sorterResult = _sorter as SorterResult<TableListItem>;
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
                setExprId(selectedRows[0].id);
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
        request={(params) => queryExpr(params)}
        columns={columns}
        rowSelection={{}}
        options={{ fullScreen: false, reload: false, setting: false, density: false }}
        className="table"
      />
      <EditForm
        onSubmit={async (value) => {
          const success = await handleEdit(value);
          if (success) {
            setExprId(undefined);
            setEditModalVisible(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => {
          setExprId(undefined);
          setEditModalVisible(false);
        }}
        modalVisible={editModalVisible}
        id={exprId}
      />
    </PageHeaderWrapper>
  );
};

export default TableList;
