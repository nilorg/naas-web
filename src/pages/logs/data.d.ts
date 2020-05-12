export interface TableListItem {
  id: string;
  job_id: string;
  job: any;
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
  job_id?: string;
  name?: string;
  worker?: string;
  sorter?: string;
  pageSize?: number;
  currentPage?: number;
}
