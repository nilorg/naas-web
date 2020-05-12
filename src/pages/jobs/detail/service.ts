import request from '@/utils/request';

export async function getJob(params: { id: string }) {
  return request(`/execution_logs?job_log_id=${params.id}`, {
    method: 'GET',
  });
}
