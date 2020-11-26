import request from '@/utils/request';

export async function queryRoleResourceWebRoute(roleCode: string, resourceServerId: number) {
  return request.get(`/casbin/role/${roleCode}/resource/${resourceServerId}/routes`);
}

export async function addRoleResourceWebRoute(roleCode: string, params: any) {
  return request(`/casbin/role/${roleCode}/resource_routes`, {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}

export async function queryRoleResourceWebMenu(roleCode: string, resourceServerId: number) {
  return request.get(`/casbin/role/${roleCode}/resource/${resourceServerId}/menus`);
}

export async function addRoleResourceWebMenu(roleCode: string, params: any) {
  return request(`/casbin/role/${roleCode}/resource_menus`, {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}

export async function queryRoleResourceAction(roleCode: string, resourceServerId: number) {
  return request.get(`/casbin/role/${roleCode}/resource/${resourceServerId}/actions`);
}

export async function addRoleResourceAction(roleCode: string, params: any) {
  return request(`/casbin/role/${roleCode}/resource_actions`, {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}
