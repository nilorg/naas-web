import request from '@/utils/request';

// getTree  获取组织列表
export async function getTree(organizationId?: number) {
  return request.get(
    `/roles?q=tree_select${organizationId ? `&organization_id=${organizationId}` : ''}&limit=30`,
  );
}
