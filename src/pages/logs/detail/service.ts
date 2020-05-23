import request from '@/utils/request';

export async function getJobLog(params: { id: string }) {
  return request(`/execution_logs?id=${params.id}`, {
    method: 'GET',
  });
}
