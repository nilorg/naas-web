import request from '@/utils/request';
import response from '@/utils/response';
import { TableListParams } from './data';

export async function queryTreeForResourceWebMenu(resourceServerId?: number) {
  return request.get('/common/tree', {
    params: {
      q: 'resource_menu',
      resource_server_id: resourceServerId,
    },
  });
}

export async function query(params?: TableListParams) {
  const result = await request.get('/resource/menus', {
    params,
  });
  return response.toPageResult(result, (i: any) => i);
}

export async function remove(params: { ids: string[] }) {
  return request.delete(`/resource/menus?ids=${params.ids.join(',')}`);
}

export async function getById(id: string) {
  return request.get(`/resource/menus/${id}`);
}

export async function edit(params: any) {
  return request(`/resource/menus${params.id ? `/${params.id}` : ''}`, {
    method: params.id ? 'PUT' : 'POST',
    data: {
      ...params,
    },
  });
}
