import request from '@/utils/request';
import { OAUTH2_CLIENT_ID } from '@/utils/constants';

export interface CodeParamsType {
  code: string;
}

export async function authCode(params: CodeParamsType) {
  return request.get('/auth/token', {
    params: { ...params, client_id: OAUTH2_CLIENT_ID },
  });
}
