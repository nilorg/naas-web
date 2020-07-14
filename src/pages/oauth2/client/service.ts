import request from '@/utils/request';
import response from '@/utils/response';
import { TableListParams } from './data';

export async function query(params?: TableListParams) {
  const result = await request.get('/oauth2/clients', {
    params,
  });
  return response.toPageResult(result, (i: any) => i);
}

export async function remove(params: { ids: string[] }) {
  return request.delete(`/oauth2/clients/${params.ids.join(',')}`);
}

export async function getById(id: string) {
  return request.get(`/oauth2/clients/${id}`);
}

export async function edit(params: any) {
  return request(`/oauth2/clients${params.id ? `/${params.id}` : ''}`, {
    method: params.id ? 'PUT' : 'POST',
    data: {
      ...params,
    },
  });
}
