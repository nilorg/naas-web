import request from '@/utils/request';

export async function queryRoleResourceWebRoute(roleCode: string, resourceServerId: number) {
  return request.get(`/casbin/role/${roleCode}/resource/${resourceServerId}/web_routes`);
}

export async function addRoleResourceWebRoute(roleCode: string, params: any) {
  return request(`/casbin/role/${roleCode}/resource_web_route`, {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}
