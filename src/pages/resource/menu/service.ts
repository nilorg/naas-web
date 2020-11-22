import request from '@/utils/request';
import response from '@/utils/response';
import { TableListParams } from './data';

export async function queryTreeForResourceWebMenu(resourceServerId?: number) {
  return request.get('/common/tree', {
    params: {
      q: 'resource_web_menu',
      resource_server_id: resourceServerId,
    },
  });
}

export async function query(params?: TableListParams) {
  const result = await request.get('/resource/web_menus', {
    params,
  });
  return response.toPageResult(result, (i: any) => i);
}

export async function remove(params: { ids: string[] }) {
  return request.delete(`/resource/web_menus?ids=${params.ids.join(',')}`);
}

export async function getById(id: string) {
  return request.get(`/resource/web_menus/${id}`);
}

export async function edit(params: any) {
  return request(`/resource/web_menus${params.id ? `/${params.id}` : ''}`, {
    method: params.id ? 'PUT' : 'POST',
    data: {
      ...params,
    },
  });
}
