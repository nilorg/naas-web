import request from '@/utils/request';
import response from '@/utils/response';
import { TableListParams } from './data';

export async function query(params?: TableListParams) {
  const result = await request.get('/users', {
    params,
  });
  return response.toPageResult(result, (i: any) => i);
}

export async function remove(params: { ids: string[] }) {
  return request.delete(`/users/${params.ids.join(',')}`);
}

export async function getById(id: string) {
  return request.get(`/users/${id}`);
}

export async function edit(params: any) {
  return request(`/users${params.id ? `/${params.id}` : ''}`, {
    method: params.id ? 'PUT' : 'POST',
    data: {
      ...params,
    },
  });
}
export async function editRoles(userId: string, params: any) {
  return request(`/users/${userId}/roles`, {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}

export async function getOrganizationByUserId(id: string) {
  return request.get(`/users/${id}/organizations`);
}

export async function getRolesByUserIdAndOrganizationId(userId: string, organizationId: number) {
  return request.get(`/users/${userId}/organizations/${organizationId}/roles`);
}
