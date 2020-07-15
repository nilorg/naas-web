import request from '@/utils/request';
import response from '@/utils/response';
import { TableListParams } from './data';

export async function query(params?: TableListParams) {
  const result = await request.get('/oauth2/scopes?q=paged', {
    params,
  });
  return response.toPageResult(result, (i: any) => i);
}

export async function remove(params: { codes: string[] }) {
  return request.delete(`/oauth2/scopes/${params.codes.join(',')}`);
}

export async function getByCode(code: string) {
  return request.get(`/oauth2/scopes/${code}`);
}

export async function edit(params: any) {
  return request(`/oauth2/scopes${params.code ? `/${params.code}` : ''}`, {
    method: params.code ? 'PUT' : 'POST',
    data: {
      ...params,
    },
  });
}
