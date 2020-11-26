import request from '@/utils/request';
import response from '@/utils/response';
import { TableListParams } from './data';

export async function query(params?: TableListParams) {
  const result = await request.get('/resource/actions', {
    params,
  });
  return response.toPageResult(result, (i: any) => i);
}

export async function remove(params: { ids: string[] }) {
  return request.delete(`/resource/actions?ids=${params.ids.join(',')}`);
}

export async function getById(id: string) {
  return request.get(`/resource/actions/${id}`);
}

export async function edit(params: any) {
  return request(`/resource/actions${params.id ? `/${params.id}` : ''}`, {
    method: params.id ? 'PUT' : 'POST',
    data: {
      ...params,
    },
  });
}
