import request from '@/utils/request';

// getTree  获取组织列表
export async function getTree(id?: any, organizationId?: number) {
  return request.get(
    `/roles?q=tree_node${id ? `&id=${id}` : ''}${
      organizationId ? `&organization_id=${organizationId}` : ''
    }&limit=30`,
  );
}
