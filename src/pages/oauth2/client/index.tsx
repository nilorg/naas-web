import React, { useState, useRef } from 'react';
import { Button, Dropdown, Menu, message } from 'antd';
import { DownOutlined, PlusOutlined, DeleteFilled, EditFilled } from '@ant-design/icons';
import ProTable, { ProColumns, ActionType, RequestData } from '@ant-design/pro-table';
import { UseFetchDataAction } from '@ant-design/pro-table/lib/useFetchData';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { SorterResult } from 'antd/es/table/interface';

import { removeConfirm } from '@/components/modal';
import EditForm from './components/EditForm';
import { query, edit, remove, editClientScopes } from './service';
import EditScopeForm from './components/EditScopeForm';

/**
 * 编辑客户端
 * @param fields
 */
const handleEditClient = async (fields: any) => {
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
 * 编辑客户端范围
 * @param fields
 */
const handleEditClientScopes = async (fields: any, clientId?: string) => {
  if (!clientId) {
    message.error('修改失败，OAuth2客户端ID不存在');
    return false;
  }
  const hide = message.loading('正在保存');
  try {
    const resp = await editClientScopes(clientId, fields);
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
 *  删除客户端
 * @param selectedRows
 */
const handleRemove = async (action: UseFetchDataAction<RequestData<any>>, selectedRows: any[]) => {
  removeConfirm({
    name: 'OAuth2客户端',
    count: selectedRows.length,
    onOk: async () => {
      const hide = message.loading('正在删除');
      if (!selectedRows) return true;
      try {
        const result = await remove({
          ids: selectedRows.map((row) => row.client_id),
        });
        hide();
        if (result.status === 'ok') {
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

interface editClientState {
  modalVisible: boolean;
  id?: string;
}

interface editClientScopeState {
  modalVisible: boolean;
  clientId?: string;
}

const TableList: React.FC<{}> = () => {
  const [sorter, setSorter] = useState<string>('');
  const [editClient, setEditClient] = useState<editClientState>({
    modalVisible: false,
  });
  const [editClientScope, setEditClientScope] = useState<editClientScopeState>({
    modalVisible: false,
  });
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<any>[] = [
    {
      title: '客户端ID',
      dataIndex: 'client_id',
    },
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '描述',
      dataIndex: 'description',
      hideInSearch: true,
    },
    {
      title: 'Logo',
      dataIndex: 'profile',
      hideInSearch: true,
      render: (_, record: any) => {
        // eslint-disable-next-line jsx-a11y/alt-text
        return <img width={48} height={48} src={record.profile} />;
      },
    },
    {
      title: '回调地址',
      dataIndex: 'redirect_uri',
      hideInSearch: true,
    },
    {
      title: '网站',
      dataIndex: 'website',
      hideInSearch: true,
    },
    {
      title: '操作',
      valueType: 'option',
      dataIndex: 'client_id',
      render: (val: any) => [
        <a
          key={`editScope_${val}`}
          onClick={() => {
            setEditClientScope({
              modalVisible: true,
              clientId: val,
            });
          }}
        >
          范围配置
        </a>,
      ],
    },
  ];

  return (
    <PageHeaderWrapper title={false}>
      <ProTable<any>
        actionRef={actionRef}
        rowKey="client_id"
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
          <Button
            type="primary"
            onClick={() =>
              setEditClient({
                ...editClient,
                modalVisible: true,
              })
            }
          >
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
                setEditClient({
                  modalVisible: true,
                  id: selectedRows[0].client_id,
                });
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
          const success = await handleEditClient(value);
          if (success) {
            setEditClient({
              modalVisible: false,
              id: undefined,
            });
            if (actionRef.current) {
              actionRef.current.reload();
            }
          }
        }}
        onCancel={() => {
          setEditClient({
            modalVisible: false,
            id: undefined,
          });
        }}
        modalVisible={editClient.modalVisible}
        id={editClient.id}
      />
      <EditScopeForm
        onSubmit={async (value) => {
          const success = await handleEditClientScopes(value, editClientScope.clientId);
          if (success) {
            setEditClientScope({
              modalVisible: false,
              clientId: undefined,
            });
          }
        }}
        onCancel={() => {
          setEditClientScope({
            modalVisible: false,
            clientId: undefined,
          });
        }}
        modalVisible={editClientScope.modalVisible}
        clientId={editClientScope.clientId}
      />
    </PageHeaderWrapper>
  );
};

export default TableList;
