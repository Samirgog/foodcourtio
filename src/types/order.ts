export type OrderStatus = 
  | 'pending'
  | 'confirmed' 
  | 'preparing'
  | 'ready'
  | 'served'
  | 'completed'
  | 'cancelled';

export type PaymentMethod = 
  | 'cash'
  | 'card'
  | 'digital_wallet'
  | 'bank_transfer';

export type SortField = 
  | 'orderDate'
  | 'orderNumber'
  | 'totalAmount'
  | 'status'
  | 'tableNumber';

export type SortDirection = 'asc' | 'desc';

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  notes?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  orderDate: Date;
  tableNumber: number;
  status: OrderStatus;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  items: OrderItem[];
  customerNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderFilters {
  status?: OrderStatus[];
  paymentMethod?: PaymentMethod[];
  dateFrom?: Date;
  dateTo?: Date;
  tableNumber?: number;
  minAmount?: number;
  maxAmount?: number;
}

export interface OrderSorting {
  field: SortField;
  direction: SortDirection;
}

export interface OrderPagination {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

export interface OrdersState {
  orders: Order[];
  filteredOrders: Order[];
  paginatedOrders: Order[];
  filters: OrderFilters;
  sorting: OrderSorting;
  pagination: OrderPagination;
  isLoading: boolean;
  error: string | null;
}

export interface OrdersActions {
  fetchOrders: () => Promise<void>;
  updateFilters: (filters: Partial<OrderFilters>) => void;
  updateSorting: (sorting: OrderSorting) => void;
  updatePagination: (pagination: Partial<OrderPagination>) => void;
  clearFilters: () => void;
  refreshOrders: () => Promise<void>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  applyFiltersAndSorting: () => void;
  applyPagination: () => void;
}

export type OrdersStore = OrdersState & OrdersActions;