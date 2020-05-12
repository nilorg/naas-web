import React, { useState, useRef } from 'react';
import { Button, Dropdown, Menu, message } from 'antd';
import { DownOutlined, PlusOutlined, DeleteFilled, EditFilled } from '@ant-design/icons';
import ProTable, { ProColumns, ActionType, RequestData } from '@ant-design/pro-table';
import { UseFetchDataAction } from '@ant-design/pro-table/lib/useFetchData';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { SorterResult } from 'antd/es/table/interface';
import moment from 'moment';

import { removeConfirm } from '@/components/modal';
import EditForm, { EditFormValueType } from './components/EditForm';
import { TableListItem } from './data';
import { queryColumn, updateColumn, removeColumn } from './service';

// /**
//  * 添加节点
//  * @param value
//  */
// const handleAdd = async (value: EditFormValueType) => {
//   const hide = message.loading('正在添加');
//   try {
//     const result = await addColumn({ ...value });
//     hide();
//     if (result.code === 1) {
//       message.success('添加成功');
//       return true;
//     }
//     message.error('添加失败');
//     return false;
//   } catch (error) {
//     hide();
//     message.error('添加失败请重试！');
//     return false;
//   }
// };

/**
 * 更新节点
 * @param fields
 */
const handleUpdate = async (fields: EditFormValueType) => {
  const hide = message.loading('正在修改');
  try {
    const result = await updateColumn({
      name: fields.name,
      parentCode: fields.parentCode,
      id: fields.id,
    });
    hide();
    if (result.code === 1) {
      message.success('修改成功');
      return true;
    }
    message.error('修改失败');
    return false;
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
    name: '栏目',
    count: selectedRows.length,
    onOk: async () => {
      const hide = message.loading('正在删除');
      if (!selectedRows) return true;
      try {
        const result = await removeColumn({
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
  const [updateFormValues, setUpdateFormValues] = useState({});
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '表达式',
      dataIndex: 'name',
    },
    {
      title: '状态',
      dataIndex: 'enabled',
      hideInForm: true,
      hideInSearch: true,
      valueEnum: {
        '0': { text: '禁用', status: 'Processing' },
        '1': { text: '启用', status: 'Success' },
      },
    },
    {
      title: '创建人',
      dataIndex: 'createUser',
      hideInForm: true,
      hideInSearch: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      sorter: true,
      valueType: 'dateRange',
      renderText: (str) => (str ? moment(str).format('YYYY-MM-DD HH:mm:ss') : null),
      hideInForm: true,
    },
    {
      title: '最后修改人',
      dataIndex: 'updateUser',
      hideInForm: true,
      hideInSearch: true,
    },
    {
      title: '最后修改时间',
      dataIndex: 'updateTime',
      sorter: true,
      valueType: 'dateRange',
      renderText: (str) => moment(str).format('YYYY-MM-DD HH:mm:ss'),
      hideInForm: true,
      hideInSearch: true,
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
                  <Menu.Item key="approval">批量停用</Menu.Item>
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
                setUpdateFormValues(selectedRows[0]);
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
        request={(params) => queryColumn(params)}
        columns={columns}
        rowSelection={{}}
        options={{ fullScreen: false, reload: false, setting: false, density: false }}
        className="table"
      />
      <EditForm
        onSubmit={async (value) => {
          const success = await handleUpdate(value);
          if (success) {
            setUpdateFormValues({});
            setEditModalVisible(false);
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => {
          setUpdateFormValues({});
          setEditModalVisible(false);
        }}
        modalVisible={editModalVisible}
        values={updateFormValues}
      />
    </PageHeaderWrapper>
  );
};

export default TableList;
