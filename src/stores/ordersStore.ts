import { create } from 'zustand';
import { 
  Order, 
  OrderStatus, 
  OrderFilters, 
  OrderSorting, 
  OrderPagination, 
  OrdersStore,
  PaymentMethod,
  OrderItem
} from '../types/order';

// Mock data generator for demonstration
const generateMockOrders = (): Order[] => {
  const statuses: OrderStatus[] = ['pending', 'confirmed', 'preparing', 'ready', 'served', 'completed', 'cancelled'];
  const paymentMethods: PaymentMethod[] = ['cash', 'card', 'digital_wallet', 'bank_transfer'];
  const productNames = [
    'Margherita Pizza', 'Caesar Salad', 'Beef Burger', 'Chicken Wings', 'Fish & Chips',
    'Pasta Carbonara', 'Grilled Salmon', 'Vegetable Curry', 'Chocolate Cake', 'Ice Cream',
    'French Fries', 'Onion Rings', 'Garlic Bread', 'Mushroom Risotto', 'Steak'
  ];

  const orders: Order[] = [];
  
  for (let i = 1; i <= 150; i++) {
    const orderDate = new Date();
    orderDate.setDate(orderDate.getDate() - Math.floor(Math.random() * 30));
    orderDate.setHours(Math.floor(Math.random() * 12) + 10); // 10 AM to 10 PM
    orderDate.setMinutes(Math.floor(Math.random() * 60));

    const itemCount = Math.floor(Math.random() * 5) + 1;
    const items: OrderItem[] = [];
    let totalAmount = 0;

    for (let j = 0; j < itemCount; j++) {
      const productName = productNames[Math.floor(Math.random() * productNames.length)];
      const unitPrice = Math.floor(Math.random() * 30) + 8; // $8-$38
      const quantity = Math.floor(Math.random() * 3) + 1; // 1-3 items
      const totalPrice = unitPrice * quantity;
      
      items.push({
        id: `item-${i}-${j}`,
        productId: `product-${Math.floor(Math.random() * 100)}`,
        productName,
        unitPrice,
        quantity,
        totalPrice,
      });
      
      totalAmount += totalPrice;
    }

    orders.push({
      id: `order-${i}`,
      orderNumber: `ORD-${String(i).padStart(4, '0')}`,
      orderDate,
      tableNumber: Math.floor(Math.random() * 20) + 1,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      totalAmount: Math.round(totalAmount * 100) / 100, // Round to 2 decimal places
      paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
      items,
      createdAt: orderDate,
      updatedAt: orderDate,
    });
  }

  return orders.sort((a, b) => b.orderDate.getTime() - a.orderDate.getTime());
};

const defaultFilters: OrderFilters = {};

const defaultSorting: OrderSorting = {
  field: 'orderDate',
  direction: 'desc'
};

const defaultPagination: OrderPagination = {
  page: 1,
  pageSize: 10,
  totalItems: 0,
  totalPages: 0
};

export const useOrdersStore = create<OrdersStore>((set, get) => ({
  // State
  orders: [],
  filteredOrders: [],
  paginatedOrders: [],
  filters: defaultFilters,
  sorting: defaultSorting,
  pagination: defaultPagination,
  isLoading: false,
  error: null,

  // Actions
  fetchOrders: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const orders = generateMockOrders();
      set({ orders, isLoading: false });
      
      // Apply current filters and sorting
      get().applyFiltersAndSorting();
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch orders',
        isLoading: false 
      });
    }
  },

  updateFilters: (newFilters: Partial<OrderFilters>) => {
    const filters = { ...get().filters, ...newFilters };
    set({ filters, pagination: { ...get().pagination, page: 1 } });
    get().applyFiltersAndSorting();
  },

  updateSorting: (sorting: OrderSorting) => {
    set({ sorting });
    get().applyFiltersAndSorting();
  },

  updatePagination: (paginationUpdate: Partial<OrderPagination>) => {
    const pagination = { ...get().pagination, ...paginationUpdate };
    set({ pagination });
    get().applyPagination();
  },

  clearFilters: () => {
    set({ filters: defaultFilters, pagination: { ...get().pagination, page: 1 } });
    get().applyFiltersAndSorting();
  },

  refreshOrders: async () => {
    await get().fetchOrders();
  },

  updateOrderStatus: async (orderId: string, status: OrderStatus) => {
    const { orders } = get();
    const updatedOrders = orders.map(order => 
      order.id === orderId 
        ? { ...order, status, updatedAt: new Date() }
        : order
    );
    
    set({ orders: updatedOrders });
    get().applyFiltersAndSorting();
  },

  // Helper functions (not exposed in interface)
  applyFiltersAndSorting: () => {
    const { orders, filters, sorting } = get();
    
    // Apply filters
    let filtered = orders.filter(order => {
      if (filters.status && filters.status.length > 0 && !filters.status.includes(order.status)) {
        return false;
      }
      
      if (filters.paymentMethod && filters.paymentMethod.length > 0 && !filters.paymentMethod.includes(order.paymentMethod)) {
        return false;
      }
      
      if (filters.dateFrom && order.orderDate < filters.dateFrom) {
        return false;
      }
      
      if (filters.dateTo) {
        const dateTo = new Date(filters.dateTo);
        dateTo.setHours(23, 59, 59, 999); // End of day
        if (order.orderDate > dateTo) {
          return false;
        }
      }
      
      if (filters.tableNumber && order.tableNumber !== filters.tableNumber) {
        return false;
      }
      
      if (filters.minAmount && order.totalAmount < filters.minAmount) {
        return false;
      }
      
      if (filters.maxAmount && order.totalAmount > filters.maxAmount) {
        return false;
      }
      
      return true;
    });

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any = a[sorting.field];
      let bValue: any = b[sorting.field];
      
      if (sorting.field === 'orderDate') {
        aValue = aValue.getTime();
        bValue = bValue.getTime();
      }
      
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }
      
      let comparison = 0;
      if (aValue > bValue) {
        comparison = 1;
      } else if (aValue < bValue) {
        comparison = -1;
      }
      
      return sorting.direction === 'desc' ? -comparison : comparison;
    });

    const totalItems = filtered.length;
    const totalPages = Math.ceil(totalItems / get().pagination.pageSize);
    
    set({ 
      filteredOrders: filtered,
      pagination: { 
        ...get().pagination, 
        totalItems, 
        totalPages 
      }
    });
    
    get().applyPagination();
  },

  applyPagination: () => {
    const { filteredOrders, pagination } = get();
    const startIndex = (pagination.page - 1) * pagination.pageSize;
    const endIndex = startIndex + pagination.pageSize;
    const paginatedOrders = filteredOrders.slice(startIndex, endIndex);
    
    set({ paginatedOrders });
  }
}));