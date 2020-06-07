import request from '@/utils/request';
import response from '@/utils/response';
import { TableListParams } from './data';

export async function queryExpr(params?: TableListParams) {
  const result = await request.get('/cron_expressions', {
    params,
  });
  return response.toPageResult(result, (i: any) => i);
}

export async function removeExpr(params: { ids: string[] }) {
  return request.delete(`/cron_expressions/${params.ids.join(',')}`);
}

export async function getExpr(id: string) {
  return request.get(`/cron_expressions/${id}`);
}

export async function editExpr(params: any) {
  return request(`/cron_expressions${params.id ? `/${params.id}` : ''}`, {
    method: params.id ? 'PUT' : 'POST',
    data: {
      ...params,
    },
  });
}

export async function nextCronExpr(cronLine: string) {
  return request.post('/next_cron_expr', {
    requestType: 'form',
    data: {
      cronLine,
      n: 5,
    },
  });
}
