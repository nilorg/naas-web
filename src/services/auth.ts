import request from '@/utils/request';

export interface CodeParamsType {
  code: string;
}

export async function authCode(params: CodeParamsType) {
  return request.get('/auth/token', {
    params,
  });
}
