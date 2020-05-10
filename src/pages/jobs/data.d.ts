export interface TableListItem {
  id: string;
  name: string;
  desc: string;
  sync: boolean;
  type: string;
  cron_expr: string;
  callNo: number;
  status: number;
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
  sorter?: string;
  status?: string;
  name?: string;
  desc?: string;
  id?: string;
  pageSize?: number;
  currentPage?: number;
}
