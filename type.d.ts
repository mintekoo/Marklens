type Period = 'daily' | 'weekly' | 'monthly' | '3months' | '6months' | 'yearly' | 'max';

interface ConverterProps {
  symbol: string;
  icon: string;
  priceList: Record<string, number>;
}

interface LiveCoinHeaderProps {
  name: string;
  image: string;
  livePrice?: number;
  livePriceChangePercentage24h: number;
  priceChangePercentage30d: number;
  priceChange24h: number;
}

interface DataTableColumn<T> {
  header: React.ReactNode;
  cell: (row: T, index: number) => React.ReactNode;
  headClassName?: string;
  cellClassName?: string;
}

interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  rowKey: (row: T, index: number) => React.Key;
  tableClassName?: string;
  headerClassName?: string;
  headerRowClassName?: string;
  headerCellClassName?: string;
  bodyRowClassName?: string;
  bodyCellClassName?: string;
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  hasMorePages: boolean;
}
