import request from '@/utils/request';
import response from '@/utils/response';
import moment from 'moment';
import { TableListParams } from './data';
import { EditFormValueType } from './components/EditForm';

export async function getTreeData(params: { type: string }) {
  const result = await request.get(`/cron_expressions/${params.type}/tree`);
  if (result.code === 1) {
    return result.data || [];
  }
  return [];
}

export async function queryColumn(params?: TableListParams) {
  const tp: {
    startCreateTime?: string;
    endCreateTime?: string;
  } = {};

  if (params?.createTime) {
    const len = params?.createTime?.length;
    if (len === 1) {
      tp.startCreateTime = moment(params?.createTime[0]).format('YYYY/MM/DD');
    } else if (len === 2) {
      tp.startCreateTime = moment(params?.createTime[0]).format('YYYY/MM/DD');
      tp.endCreateTime = moment(params?.createTime[1]).format('YYYY/MM/DD');
    }
  }

  const result = await request.get('/cron_expressions', {
    params: {
      page: params?.current,
      size: params?.pageSize,
      name: params?.name,
      code: params?.code,
      // parentCode: params?.parentCode,
      parentName: params?.parentName,
      ...tp,
    },
  });
  return response.toTataResult(result, (i) => ({
    ...i,
    updateTime: i || '',
  }));
}

export async function removeColumn(params: { ids: string[] }) {
  return request.delete(`/cron_expressions/${params.ids.join(',')}`);
}

export async function addColumn(params: EditFormValueType) {
  return request.post('/cron_expressions', {
    data: {
      ...params,
    },
  });
}

export async function updateColumn(params: EditFormValueType) {
  return request.put('/cron_expressions', {
    data: {
      ...params,
    },
  });
}
