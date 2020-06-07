export interface TableListItem {
  id: string;
  name: string;
  expr: string;
  description: string;
}

export interface TableListPagination {
  total: number;
  pageSize: number;
  current: number;
}

export interface TableListData {
  list: TableListItem[];
  pagination: Partial<TableListPagination>;
}

export interface TableListParams {
  current?: number;
  pageSize?: number;
  sorter?: string;

  name?: string;
  code?: string;
  // parentCode?: string;
  parentName?: string;
  createTime?: string[];
}
