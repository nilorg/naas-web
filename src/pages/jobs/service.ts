import request from '@/utils/request';
import response from '@/utils/response';
import { TableListParams } from './data.d';
import { FormValueType } from './components/EditForm';

export async function queryJobs(params?: TableListParams) {
  const result = await request.get('/jobs', {
    params,
  });
  return response.toTataResult(result, (i) => i);
}

export async function removeJob(params: { ids: string[] }) {
  return request('/jobs', {
    method: 'POST',
    data: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addJob(params: FormValueType) {
  return request('/jobs', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}

export async function updateJob(params: FormValueType) {
  return request('/jobs', {
    method: 'POST',
    data: {
      ...params,
    },
  });
}
