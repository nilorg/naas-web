import request from '@/utils/request';
import response from '@/utils/response';
import { TableListParams } from './data.d';

export async function queryJobs(params?: TableListParams) {
  const result = await request.get('/logs', {
    params,
  });
  return response.toTataResult(result, (i) => i);
}
