import request from '@/utils/request';
import response from '@/utils/response';
import { TableListParams } from './data';

export async function queryExpr(params?: TableListParams) {
  const result = await request.get('/users', {
    params,
  });
  return response.toPageResult(result, (i: any) => i);
}

export async function removeExpr(params: { ids: string[] }) {
  return request.delete(`/users/${params.ids.join(',')}`);
}

export async function getExpr(id: string) {
  return request.get(`/users/${id}`);
}

export async function editExpr(params: any) {
  return request(`/users${params.id ? `/${params.id}` : ''}`, {
    method: params.id ? 'PUT' : 'POST',
    data: {
      ...params,
    },
  });
}
