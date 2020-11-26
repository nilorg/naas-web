import React, { useEffect, useState } from 'react';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { queryResourceAction } from './service';

interface ActionTableProps {
  actionRef: React.MutableRefObject<ActionType | undefined> | ((actionRef: ActionType) => void);
  resourceServerId: number;
  defaultSelectedRowKeys: string[];
  onChange?: (selectedRowKeys: string[]) => void;
}

const ActionTable: React.FC<ActionTableProps> = ({
  actionRef,
  resourceServerId,
  defaultSelectedRowKeys,
  onChange,
}) => {
  const columns: ProColumns<any>[] = [
    {
      title: 'CODE',
      dataIndex: 'code',
      hideInSearch: true,
    },
    {
      title: '名称',
      dataIndex: 'name',
      hideInSearch: true,
    },
    {
      title: '分组',
      dataIndex: 'group',
      hideInSearch: true,
    },
    {
      title: '介绍',
      dataIndex: 'description',
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
      request={(params) => queryResourceAction(resourceServerId, params)}
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

export default ActionTable;
