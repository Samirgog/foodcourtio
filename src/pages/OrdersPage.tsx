import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useOrdersStore } from '../stores/ordersStore';
import { OrderStatus, PaymentMethod, SortField, SortDirection } from '../types/order';
import { Card, Button } from '../styles/theme';
import { FadeInUp } from '../components/animations/AnimationComponents';
import OrderCard from '../components/OrderCard';

const OrdersContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.lg};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    padding: ${({ theme }) => theme.spacing.md};
  }
`;

const Header = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  
  h1 {
    font-size: ${({ theme }) => theme.fontSizes.xxl};
    font-weight: ${({ theme }) => theme.fontWeights.bold};
    color: ${({ theme }) => theme.colors.text};
    margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;
  }
  
  p {
    font-size: ${({ theme }) => theme.fontSizes.lg};
    color: ${({ theme }) => theme.colors.textSecondary};
    margin: 0;
    line-height: 1.6;
  }
`;

const ControlsSection = styled(Card)`
  padding: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: ${({ theme }) => theme.spacing.md};
  }
`;

const ControlsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr auto auto;
  gap: ${({ theme }) => theme.spacing.lg};
  align-items: end;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

const FiltersSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const FilterGroup = styled.div`
  label {
    display: block;
    font-weight: ${({ theme }) => theme.fontWeights.medium};
    color: ${({ theme }) => theme.colors.text};
    margin-bottom: ${({ theme }) => theme.spacing.xs};
    font-size: ${({ theme }) => theme.fontSizes.sm};
  }
`;

const Select = styled.select`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  transition: ${({ theme }) => theme.transitions.fast};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  transition: ${({ theme }) => theme.transitions.fast};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
  }
`;

const SortControls = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  align-items: end;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    flex-direction: column;
  }
`;

const OrdersGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.xl};
  
  .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid ${({ theme }) => theme.colors.border};
    border-top: 4px solid ${({ theme }) => theme.colors.primary};
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xl};
  color: ${({ theme }) => theme.colors.textMuted};
  
  .icon {
    font-size: 4rem;
    margin-bottom: ${({ theme }) => theme.spacing.lg};
  }
  
  h3 {
    font-size: ${({ theme }) => theme.fontSizes.lg};
    margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;
    color: ${({ theme }) => theme.colors.text};
  }
  
  p {
    margin: 0;
    font-size: ${({ theme }) => theme.fontSizes.md};
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.md};
  }
`;

const PaginationInfo = styled.span`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

const PaginationControls = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  align-items: center;
`;

const PageSizeSelector = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  
  label {
    font-size: ${({ theme }) => theme.fontSizes.sm};
    color: ${({ theme }) => theme.colors.text};
  }
  
  select {
    padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.borderRadius.sm};
    background-color: ${({ theme }) => theme.colors.surface};
    color: ${({ theme }) => theme.colors.text};
    font-size: ${({ theme }) => theme.fontSizes.sm};
  }
`;

const StatusBadge = styled.span<{ status: OrderStatus }>`
  display: inline-flex;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  ${({ status, theme }) => {
    switch (status) {
      case 'pending':
        return `
          background-color: ${theme.colors.warning}20;
          color: ${theme.colors.warning};
        `;
      case 'confirmed':
        return `
          background-color: ${theme.colors.info}20;
          color: ${theme.colors.info};
        `;
      case 'preparing':
        return `
          background-color: ${theme.colors.accent}20;
          color: ${theme.colors.accent};
        `;
      case 'ready':
        return `
          background-color: ${theme.colors.primary}20;
          color: ${theme.colors.primary};
        `;
      case 'served':
      case 'completed':
        return `
          background-color: ${theme.colors.success}20;
          color: ${theme.colors.success};
        `;
      case 'cancelled':
        return `
          background-color: ${theme.colors.error}20;
          color: ${theme.colors.error};
        `;
      default:
        return `
          background-color: ${theme.colors.border};
          color: ${theme.colors.textMuted};
        `;
    }
  }}
`;

const OrdersPage: React.FC = () => {
  const {
    paginatedOrders,
    filters,
    sorting,
    pagination,
    isLoading,
    error,
    fetchOrders,
    updateFilters,
    updateSorting,
    updatePagination,
    clearFilters,
    refreshOrders
  } = useOrdersStore();

  const [localFilters, setLocalFilters] = useState({
    status: '',
    paymentMethod: '',
    dateFrom: '',
    dateTo: '',
    tableNumber: '',
  });

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleFilterChange = (field: string, value: string) => {
    setLocalFilters(prev => ({ ...prev, [field]: value }));
  };

  const applyFilters = () => {
    const filterUpdate: any = {};
    
    if (localFilters.status) {
      filterUpdate.status = [localFilters.status as OrderStatus];
    }
    
    if (localFilters.paymentMethod) {
      filterUpdate.paymentMethod = [localFilters.paymentMethod as PaymentMethod];
    }
    
    if (localFilters.dateFrom) {
      filterUpdate.dateFrom = new Date(localFilters.dateFrom);
    }
    
    if (localFilters.dateTo) {
      filterUpdate.dateTo = new Date(localFilters.dateTo);
    }
    
    if (localFilters.tableNumber) {
      filterUpdate.tableNumber = parseInt(localFilters.tableNumber);
    }

    updateFilters(filterUpdate);
  };

  const handleClearFilters = () => {
    setLocalFilters({
      status: '',
      paymentMethod: '',
      dateFrom: '',
      dateTo: '',
      tableNumber: '',
    });
    clearFilters();
  };

  const handleSortChange = (field: SortField) => {
    const direction: SortDirection = 
      sorting.field === field && sorting.direction === 'asc' ? 'desc' : 'asc';
    updateSorting({ field, direction });
  };

  const handlePageChange = (page: number) => {
    updatePagination({ page });
  };

  const handlePageSizeChange = (pageSize: number) => {
    updatePagination({ pageSize, page: 1 });
  };

  if (isLoading && paginatedOrders.length === 0) {
    return (
      <OrdersContainer>
        <LoadingContainer>
          <div className="spinner" />
        </LoadingContainer>
      </OrdersContainer>
    );
  }

  return (
    <OrdersContainer>
      <FadeInUp>
        <Header>
          <h1>📋 Order History</h1>
          <p>
            View and manage all orders with detailed information, filtering, and sorting options.
          </p>
        </Header>

        <ControlsSection>
          <ControlsGrid>
            <FiltersSection>
              <FilterGroup>
                <label htmlFor="status">Status</label>
                <Select
                  id="status"
                  value={localFilters.status}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                >
                  <option value="">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="preparing">Preparing</option>
                  <option value="ready">Ready</option>
                  <option value="served">Served</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </Select>
              </FilterGroup>

              <FilterGroup>
                <label htmlFor="paymentMethod">Payment Method</label>
                <Select
                  id="paymentMethod"
                  value={localFilters.paymentMethod}
                  onChange={(e) => handleFilterChange('paymentMethod', e.target.value)}
                >
                  <option value="">All Methods</option>
                  <option value="cash">Cash</option>
                  <option value="card">Card</option>
                  <option value="digital_wallet">Digital Wallet</option>
                  <option value="bank_transfer">Bank Transfer</option>
                </Select>
              </FilterGroup>

              <FilterGroup>
                <label htmlFor="dateFrom">From Date</label>
                <Input
                  id="dateFrom"
                  type="date"
                  value={localFilters.dateFrom}
                  onChange={(e) => handleFilterChange('dateFrom', e.target.value)}
                />
              </FilterGroup>

              <FilterGroup>
                <label htmlFor="dateTo">To Date</label>
                <Input
                  id="dateTo"
                  type="date"
                  value={localFilters.dateTo}
                  onChange={(e) => handleFilterChange('dateTo', e.target.value)}
                />
              </FilterGroup>

              <FilterGroup>
                <label htmlFor="tableNumber">Table Number</label>
                <Input
                  id="tableNumber"
                  type="number"
                  placeholder="Table #"
                  value={localFilters.tableNumber}
                  onChange={(e) => handleFilterChange('tableNumber', e.target.value)}
                />
              </FilterGroup>
            </FiltersSection>

            <SortControls>
              <FilterGroup>
                <label htmlFor="sortField">Sort by</label>
                <Select
                  id="sortField"
                  value={sorting.field}
                  onChange={(e) => handleSortChange(e.target.value as SortField)}
                >
                  <option value="orderDate">Order Date</option>
                  <option value="orderNumber">Order Number</option>
                  <option value="totalAmount">Total Amount</option>
                  <option value="status">Status</option>
                  <option value="tableNumber">Table Number</option>
                </Select>
              </FilterGroup>
            </SortControls>

            <ActionButtons>
              <Button variant="outline" onClick={applyFilters}>
                Apply Filters
              </Button>
              <Button variant="ghost" onClick={handleClearFilters}>
                Clear All
              </Button>
              <Button variant="ghost" onClick={refreshOrders}>
                🔄 Refresh
              </Button>
            </ActionButtons>
          </ControlsGrid>
        </ControlsSection>

        {error && (
          <Card style={{ padding: '1rem', marginBottom: '1rem', borderColor: '#ef4444' }}>
            <p style={{ color: '#ef4444', margin: 0 }}>Error: {error}</p>
          </Card>
        )}

        {paginatedOrders.length === 0 && !isLoading ? (
          <Card>
            <EmptyState>
              <div className="icon">📦</div>
              <h3>No Orders Found</h3>
              <p>No orders match your current filters. Try adjusting your search criteria.</p>
            </EmptyState>
          </Card>
        ) : (
          <>
            <OrdersGrid>
              {paginatedOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </OrdersGrid>

            <PaginationContainer>
              <PaginationInfo>
                Showing {((pagination.page - 1) * pagination.pageSize) + 1} to{' '}
                {Math.min(pagination.page * pagination.pageSize, pagination.totalItems)} of{' '}
                {pagination.totalItems} orders
              </PaginationInfo>

              <PaginationControls>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                >
                  Previous
                </Button>
                
                <span style={{ padding: '0 1rem', fontSize: '0.875rem' }}>
                  Page {pagination.page} of {pagination.totalPages}
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                >
                  Next
                </Button>
              </PaginationControls>

              <PageSizeSelector>
                <label>Show:</label>
                <select
                  value={pagination.pageSize}
                  onChange={(e) => handlePageSizeChange(parseInt(e.target.value))}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </PageSizeSelector>
            </PaginationContainer>
          </>
        )}
      </FadeInUp>
    </OrdersContainer>
  );
};

export default OrdersPage;