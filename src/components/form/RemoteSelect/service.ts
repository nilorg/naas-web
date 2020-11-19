import request from '@/utils/request';

// getList  获取组织列表
export async function getList(type: string, name: string) {
  return request.get(`/common/select?q=${type}&name=${name}&limit=30`);
}
// getOne  获取组织初始值
export async function getOne(type: string, id: any) {
  return request.get(`/common/select?q=${type}&id=${id}`);
}
