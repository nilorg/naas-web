import request from '@/utils/request';

// getList  获取组织列表
export async function getList(name: string) {
  return request.get(`/common/select?q=org&name=${name}&limit=30`);
}
// getOne  获取组织初始值
export async function getOne(id: number) {
  return request.get(`/common/select?q=org&id=${id}`);
}
