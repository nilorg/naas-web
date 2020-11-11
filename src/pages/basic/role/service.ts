import request from '@/utils/request';
import response from '@/utils/response';
import { TableListParams } from './data';

export async function query(params?: TableListParams) {
  const result = await request.get('/roles?q=list', {
    params,
  });
  return response.toPageResult(result, (i: any) => i);
}

export async function remove(params: { codes: string[] }) {
  return request.delete(`/roles?codes=${params.codes.join(',')}`);
}

export async function getById(code: string) {
  return request.get(`/roles/${code}`);
}

export async function edit(params: any) {
  return request(`/roles`, {
    method: params.id ? 'PUT' : 'POST',
    data: {
      ...params,
    },
  });
}
