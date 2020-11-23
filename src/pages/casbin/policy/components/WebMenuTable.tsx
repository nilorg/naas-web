import React, { useEffect, useState } from 'react';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { queryResourceWebMenu } from './service';

interface WebMenuTableProps {
  actionRef: React.MutableRefObject<ActionType | undefined> | ((actionRef: ActionType) => void);
  resourceServerId: number;
  defaultSelectedRowKeys: string[];
  onChange?: (selectedRowKeys: string[]) => void;
}

const WebMenuTable: React.FC<WebMenuTableProps> = ({
  actionRef,
  resourceServerId,
  defaultSelectedRowKeys,
  onChange,
}) => {
  const columns: ProColumns<any>[] = [
    {
      title: '名称',
      dataIndex: 'name',
    },
    {
      title: '地址',
      dataIndex: 'url',
      hideInSearch: true,
    },
    {
      title: '是否叶子菜单',
      dataIndex: 'leaf',
      hideInSearch: true,
      renderText: (v: any) => {
        return v ? '是' : '否';
      },
    },
    {
      title: '深度',
      dataIndex: 'level',
      hideInSearch: true,
    },
  ];
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>();
  useEffect(() => {
    setSelectedRowKeys(defaultSelectedRowKeys);
  }, [defaultSelectedRowKeys]);
  const onSelectChange = (keys: any) => {
    setSelectedRowKeys(keys);
    if (onChange) {
      onChange(keys);
    }
  };
  return (
    <ProTable<any>
      actionRef={actionRef}
      rowKey={(i) => i.id}
      request={(params) => queryResourceWebMenu(resourceServerId, params)}
      columns={columns}
      className="table"
      search={false}
      options={{ fullScreen: false, reload: false, setting: false, density: false }}
      rowSelection={{
        selectedRowKeys,
        onChange: onSelectChange,
      }}
      onLoad={() => {
        if (defaultSelectedRowKeys) {
          setSelectedRowKeys(defaultSelectedRowKeys);
        }
      }}
      tableAlertRender={() => false}
      toolBarRender={false}
    />
  );
};

export default WebMenuTable;
