import request from '@/utils/request';

export async function queryRoleResourceWebRoute(roleCode: string, resourceServerId: number) {
  return request.get(`/casbin/role/${roleCode}/resource/${resourceServerId}/web_routes`);
}

export async function addRoleResourceWebRoute(roleCode: string, params: any) {
  return request(`/casbin/role/${roleCode}/resource_web_routes`, {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}

export async function queryRoleResourceWebMenu(roleCode: string, resourceServerId: number) {
  return request.get(`/casbin/role/${roleCode}/resource/${resourceServerId}/web_menus`);
}

export async function addRoleResourceWebMenu(roleCode: string, params: any) {
  return request(`/casbin/role/${roleCode}/resource_web_menus`, {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}
