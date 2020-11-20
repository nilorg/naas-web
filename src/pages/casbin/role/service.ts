import request from '@/utils/request';

export async function queryRoleResourceWebRoute(roleCode: string, resourceServerId: number) {
  return request.get(`/casbin/role/${roleCode}/resource/${resourceServerId}/web_routes`);
}
