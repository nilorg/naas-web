export interface TableListItem {
  id: string;
  code: string;
  name: string;
  enabled: number;
  parentCode: string;
  deleteFlag: string;
  createUser: string;
  createTime: Date;
  updateUser: string;
  updateTime: Date;
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
