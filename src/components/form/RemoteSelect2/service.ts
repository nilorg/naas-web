import request from '@/utils/request';

// getList  获取组织列表
export async function getList(type: string) {
  return request.get(`/common/select?q=${type}`);
}
