import request from '@/utils/request';

// getTree  获取组织列表
export async function getTree() {
  return request.get(`/organizations?q=tree`);
}
