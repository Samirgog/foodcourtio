import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Order, OrderStatus } from '../types/order';
import { Card, Button } from '../styles/theme';
import { useOrdersStore } from '../stores/ordersStore';

const OrderCardContainer = styled(motion.div).attrs(() => ({
  as: Card
}))`
  overflow: hidden;
  transition: ${({ theme }) => theme.transitions.normal};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
  }
`;

const OrderHeader = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  cursor: pointer;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  }
`;

const OrderHeaderTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.sm};
  }
`;

const OrderInfo = styled.div`
  flex: 1;
`;

const OrderNumber = styled.h3`
  font-size: ${({ theme }) => theme.fontSizes.lg};
  font-weight: ${({ theme }) => theme.fontWeights.semibold};
  color: ${({ theme }) => theme.colors.text};
  margin: 0 0 ${({ theme }) => theme.spacing.xs} 0;
`;

const OrderDate = styled.p`
  font-size: ${({ theme }) => theme.fontSizes.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0;
`;

const StatusContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
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

const OrderSummary = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const SummaryItem = styled.div`
  display: flex;
  flex-direction: column;
  
  .label {
    font-size: ${({ theme }) => theme.fontSizes.xs};
    color: ${({ theme }) => theme.colors.textMuted};
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: ${({ theme }) => theme.spacing.xs};
  }
  
  .value {
    font-size: ${({ theme }) => theme.fontSizes.sm};
    font-weight: ${({ theme }) => theme.fontWeights.medium};
    color: ${({ theme }) => theme.colors.text};
  }
  
  &.amount .value {
    color: ${({ theme }) => theme.colors.primary};
    font-weight: ${({ theme }) => theme.fontWeights.semibold};
  }
`;

const ExpandIcon = styled.div<{ isExpanded: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  transition: ${({ theme }) => theme.transitions.fast};
  transform: ${({ isExpanded }) => isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'};
`;

const OrderDetails = styled(motion.div)`
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
`;

const OrderActions = styled.div`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
  }
`;

const StatusSelect = styled.select`
  padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const ItemsList = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
`;

const ItemsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  
  h4 {
    font-size: ${({ theme }) => theme.fontSizes.md};
    font-weight: ${({ theme }) => theme.fontWeights.semibold};
    color: ${({ theme }) => theme.colors.text};
    margin: 0;
  }
  
  .total-items {
    font-size: ${({ theme }) => theme.fontSizes.sm};
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

const ItemsGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const OrderItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
    align-items: stretch;
    gap: ${({ theme }) => theme.spacing.xs};
  }
`;

const ItemInfo = styled.div`
  flex: 1;
  
  .name {
    font-size: ${({ theme }) => theme.fontSizes.sm};
    font-weight: ${({ theme }) => theme.fontWeights.medium};
    color: ${({ theme }) => theme.colors.text};
    margin: 0 0 ${({ theme }) => theme.spacing.xs} 0;
  }
  
  .details {
    font-size: ${({ theme }) => theme.fontSizes.xs};
    color: ${({ theme }) => theme.colors.textMuted};
    margin: 0;
  }
`;

const ItemPricing = styled.div`
  text-align: right;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    text-align: left;
    display: flex;
    justify-content: space-between;
  }
  
  .total {
    font-size: ${({ theme }) => theme.fontSizes.sm};
    font-weight: ${({ theme }) => theme.fontWeights.semibold};
    color: ${({ theme }) => theme.colors.primary};
    margin: 0;
  }
  
  .unit-price {
    font-size: ${({ theme }) => theme.fontSizes.xs};
    color: ${({ theme }) => theme.colors.textMuted};
    margin: 0;
  }
`;

interface OrderCardProps {
  order: Order;
}

const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const { updateOrderStatus } = useOrdersStore();

  const handleStatusChange = async (newStatus: OrderStatus) => {
    if (newStatus === order.status) return;
    
    setIsUpdatingStatus(true);
    try {
      await updateOrderStatus(order.id, newStatus);
    } catch (error) {
      console.error('Failed to update order status:', error);
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const formatPaymentMethod = (method: string) => {
    return method.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getStatusOptions = (currentStatus: OrderStatus): OrderStatus[] => {
    switch (currentStatus) {
      case 'pending':
        return ['pending', 'confirmed', 'cancelled'];
      case 'confirmed':
        return ['confirmed', 'preparing', 'cancelled'];
      case 'preparing':
        return ['preparing', 'ready', 'cancelled'];
      case 'ready':
        return ['ready', 'served'];
      case 'served':
        return ['served', 'completed'];
      case 'completed':
        return ['completed'];
      case 'cancelled':
        return ['cancelled'];
      default:
        return [currentStatus];
    }
  };

  return (
    <OrderCardContainer
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <OrderHeader onClick={() => setIsExpanded(!isExpanded)}>
        <OrderHeaderTop>
          <OrderInfo>
            <OrderNumber>{order.orderNumber}</OrderNumber>
            <OrderDate>
              {order.orderDate.toLocaleDateString()} at {order.orderDate.toLocaleTimeString()}
            </OrderDate>
          </OrderInfo>
          <StatusContainer>
            <StatusBadge status={order.status}>{order.status}</StatusBadge>
            <ExpandIcon isExpanded={isExpanded}>
              ▼
            </ExpandIcon>
          </StatusContainer>
        </OrderHeaderTop>

        <OrderSummary>
          <SummaryItem>
            <div className="label">Table</div>
            <div className="value">#{order.tableNumber}</div>
          </SummaryItem>
          <SummaryItem className="amount">
            <div className="label">Total Amount</div>
            <div className="value">${order.totalAmount.toFixed(2)}</div>
          </SummaryItem>
          <SummaryItem>
            <div className="label">Payment</div>
            <div className="value">{formatPaymentMethod(order.paymentMethod)}</div>
          </SummaryItem>
          <SummaryItem>
            <div className="label">Items</div>
            <div className="value">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</div>
          </SummaryItem>
        </OrderSummary>
      </OrderHeader>

      <AnimatePresence>
        {isExpanded && (
          <OrderDetails
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <OrderActions>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <label htmlFor={`status-${order.id}`} style={{ fontSize: '0.875rem', fontWeight: '500' }}>
                  Update Status:
                </label>
                <StatusSelect
                  id={`status-${order.id}`}
                  value={order.status}
                  onChange={(e) => handleStatusChange(e.target.value as OrderStatus)}
                  disabled={isUpdatingStatus}
                >
                  {getStatusOptions(order.status).map(status => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </StatusSelect>
              </div>
              {isUpdatingStatus && (
                <Button variant="ghost" size="sm" disabled>
                  Updating...
                </Button>
              )}
            </OrderActions>

            <ItemsList>
              <ItemsHeader>
                <h4>Order Items</h4>
                <span className="total-items">
                  {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                </span>
              </ItemsHeader>

              <ItemsGrid>
                {order.items.map((item) => (
                  <OrderItem key={item.id}>
                    <ItemInfo>
                      <p className="name">{item.productName}</p>
                      <p className="details">
                        Quantity: {item.quantity} × ${item.unitPrice.toFixed(2)}
                      </p>
                    </ItemInfo>
                    <ItemPricing>
                      <p className="total">${item.totalPrice.toFixed(2)}</p>
                      <p className="unit-price">${item.unitPrice.toFixed(2)} each</p>
                    </ItemPricing>
                  </OrderItem>
                ))}
              </ItemsGrid>

              {order.customerNotes && (
                <div style={{ 
                  marginTop: '1rem', 
                  padding: '1rem', 
                  backgroundColor: 'var(--surface)', 
                  borderRadius: '0.5rem',
                  border: '1px solid var(--border)'
                }}>
                  <h5 style={{ margin: '0 0 0.5rem 0', fontSize: '0.875rem', fontWeight: '600' }}>
                    Customer Notes:
                  </h5>
                  <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    {order.customerNotes}
                  </p>
                </div>
              )}
            </ItemsList>
          </OrderDetails>
        )}
      </AnimatePresence>
    </OrderCardContainer>
  );
};

export default OrderCard;