import request from '@/utils/request';
import response from '@/utils/response';

// getOrganizationRoleTree  获取组织列表
export async function getOrganizationRoleTree(organizationId?: number) {
  return request.get(
    `/roles?q=tree_select${organizationId ? `&organization_id=${organizationId}` : ''}&limit=30`,
  );
}

// getOrganizationResourceList  获取组织的资源服务器列表
export async function getOrganizationResourceList(organizationId: number) {
  return request.get(
    `/common/select?q=resource_server&organization_id=${organizationId}&limit=999`,
  );
}

export async function queryResourceWebRoute(resourceServerId: number, params?: any) {
  if (resourceServerId === 0) {
    return {
      data: [],
      total: 0,
      success: true,
      pageSize: 10,
      current: 1,
    };
  }
  const result = await request.get(`/casbin/resource/${resourceServerId}/routes`, {
    params,
  });
  return response.toPageResult(result, (i: any) => i);
}

export async function queryResourceWebMenu(resourceServerId: number, params?: any) {
  if (resourceServerId === 0) {
    return {
      data: [],
      total: 0,
      success: true,
      pageSize: 10,
      current: 1,
    };
  }
  const result = await request.get(`/casbin/resource/${resourceServerId}/menus`, {
    params,
  });
  return response.toPageResult(result, (i: any) => i);
}

export async function queryResourceAction(resourceServerId: number, params?: any) {
  if (resourceServerId === 0) {
    return {
      data: [],
      total: 0,
      success: true,
      pageSize: 10,
      current: 1,
    };
  }
  const result = await request.get(`/casbin/resource/${resourceServerId}/actions`, {
    params,
  });
  return response.toPageResult(result, (i: any) => i);
}
