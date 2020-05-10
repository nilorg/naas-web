export default {
  toTataResult(result: any, convertItem: (item: any) => any) {
    return {
      data: result.data.list.map((i: any) => convertItem(i)) || [],
      total: result.data.pagination.total || 0,
      success: result.status === 'ok',
      pageSize: result.data.pagination.pageSize || 10,
      current: result.data.pagination.current || 0,
    };
  },
};
