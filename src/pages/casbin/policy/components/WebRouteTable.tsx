import React, { useEffect, useState } from 'react';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { queryResourceWebRoute } from './service';

interface WebRouteTableProps {
  actionRef: React.MutableRefObject<ActionType | undefined> | ((actionRef: ActionType) => void);
  resourceServerId: number;
  defaultSelectedRowKeys: string[];
  onChange?: (selectedRowKeys: string[]) => void;
}

const WebRouteTable: React.FC<WebRouteTableProps> = ({
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
      title: '方法',
      dataIndex: 'method',
      hideInSearch: true,
    },
    {
      title: '路由',
      dataIndex: 'path',
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
      request={(params) => queryResourceWebRoute(resourceServerId, params)}
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

export default WebRouteTable;
