import request from '@/utils/request';
import { TableListParams, TableListItem } from './data.d';

export async function queryJobs(params?: TableListParams) {
  return request('/jobs', {
    params,
  });
}

export async function removeJob(params: { key: number[] }) {
  return request('/jobs', {
    method: 'POST',
    data: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addJob(params: TableListItem) {
  return request('/jobs', {
    method: 'POST',
    data: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateJob(params: TableListParams) {
  return request('/jobs', {
    method: 'POST',
    data: {
      ...params,
      method: 'update',
    },
  });
}