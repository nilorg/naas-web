import React, { useState, useRef } from 'react';
// import { history } from 'umi';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { SorterResult } from 'antd/es/table/interface';

import moment from 'moment';
import { Input } from 'antd';
import { TableListItem } from './data.d';
import { queryJobs } from './service';

export interface TableListProps {
  location: any;
}

const TableList: React.FC<TableListProps> = ({ location }) => {
  const { job_id } = location.query;
  const [sorter, setSorter] = useState<string>('');
  const actionRef = useRef<ActionType>();
  const columns: ProColumns<TableListItem>[] = [
    {
      title: '任务名',
      dataIndex: 'job_name',
      hideInSearch: job_id,
      render: (_, record) => record.job?.name,
    },
    {
      title: '任务ID',
      dataIndex: 'job_id',
      hideInTable: true,
      hideInSearch: !job_id,
      renderFormItem: () => {
        return <Input value={job_id} disabled />;
      },
    },
    {
      title: 'worker节点',
      dataIndex: 'worker',
      valueType: 'textarea',
    },
    {
      title: '计划开始时间',
      dataIndex: 'plan_time',
      sorter: true,
      hideInForm: true,
      hideInSearch: true,
      renderText: (val: number) => moment.unix(val).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '实际调度时间',
      dataIndex: 'schedule_time',
      sorter: true,
      hideInForm: true,
      hideInSearch: true,
      renderText: (val: number) => moment.unix(val).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '任务执行开始时间',
      dataIndex: 'start_time',
      sorter: true,
      hideInForm: true,
      hideInSearch: true,
      renderText: (val: number) => moment.unix(val).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '任务执行结束时间',
      dataIndex: 'end_time',
      sorter: true,
      hideInForm: true,
      hideInSearch: true,
      renderText: (val: number) => moment.unix(val).format('YYYY-MM-DD HH:mm:ss'),
    },
    {
      title: '状态',
      dataIndex: 'status',
      sorter: true,
      hideInForm: true,
      hideInSearch: true,
      valueEnum: {
        1: { text: '执行成功', status: 'Success' },
        0: { text: '执行错误', status: 'Error' },
      },
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => {
        if (record.status === 0) {
          return null;
        }
        return (
          <>
            <a
              onClick={() => {
                console.log(record);
                // history.push(`/logs/execution_logs`);
              }}
            >
              查看详情
            </a>
          </>
        );
      },
    },
  ];

  return (
    <PageHeaderWrapper>
      <ProTable<TableListItem>
        actionRef={actionRef}
        rowKey="id"
        onChange={(_, _filter, _sorter) => {
          const sorterResult = _sorter as SorterResult<TableListItem>;
          if (sorterResult.field) {
            setSorter(`${sorterResult.field},${sorterResult.order}`);
          }
        }}
        params={{
          sorter,
        }}
        tableAlertRender={() => false}
        request={(params) => {
          if (job_id) {
            return queryJobs({ job_id, ...params });
          }
          return queryJobs(params);
        }}
        columns={columns}
        rowSelection={{}}
        options={{ fullScreen: false, reload: false, setting: false, density: false }}
      />
    </PageHeaderWrapper>
  );
};

export default TableList;
