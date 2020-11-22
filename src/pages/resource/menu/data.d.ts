export interface TableListPagination {
  total: number;
  pageSize: number;
  current: number;
}

export interface TableListData {
  list: any[];
  pagination: Partial<TableListPagination>;
}

export interface TableListParams {
  current?: number;
  pageSize?: number;
  sorter?: string;

  name?: string;
  code?: string;
  parentName?: string;
  createTime?: string[];
}
