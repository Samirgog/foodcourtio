import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotifications } from '../stores';
import { formatCurrency, formatDate } from '../utils';

const BillingContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
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

const BillingGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.xl};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
    gap: ${({ theme }) => theme.spacing.lg};
  }
`;

const BillingCard = styled(motion.div)`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.xl};
  transition: ${({ theme }) => theme.transitions.normal};
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: ${({ theme }) => theme.shadows.md};
  }
`;

const CardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  padding-bottom: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderLight};
`;

const CardIcon = styled.div<{ color?: string }>`
  width: 50px;
  height: 50px;
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background: ${({ color, theme }) => color || theme.colors.primaryLight};
  color: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
`;

const CardTitle = styled.div`
  h3 {
    margin: 0 0 ${({ theme }) => theme.spacing.xs} 0;
    font-size: ${({ theme }) => theme.fontSizes.xl};
    font-weight: ${({ theme }) => theme.fontWeights.semibold};
    color: ${({ theme }) => theme.colors.text};
  }
  
  p {
    margin: 0;
    font-size: ${({ theme }) => theme.fontSizes.sm};
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

const WalletBalance = styled.div`
  text-align: center;
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  
  .amount {
    font-size: ${({ theme }) => theme.fontSizes.xxxl};
    font-weight: ${({ theme }) => theme.fontWeights.bold};
    color: ${({ theme }) => theme.colors.primary};
    margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;
  }
  
  .label {
    font-size: ${({ theme }) => theme.fontSizes.md};
    color: ${({ theme }) => theme.colors.textSecondary};
    margin: 0;
  }
`;

const ActionButton = styled.button<{ variant?: 'primary' | 'secondary' | 'success' | 'warning' }>`
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  border: 1px solid;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.fast};
  width: 100%;
  margin-bottom: ${({ theme }) => theme.spacing.sm};
  
  ${({ variant, theme }) => {
    switch (variant) {
      case 'primary':
        return `
          background: ${theme.colors.primary};
          border-color: ${theme.colors.primary};
          color: white;
          
          &:hover {
            background: ${theme.colors.primaryHover};
            border-color: ${theme.colors.primaryHover};
          }
        `;
      case 'success':
        return `
          background: ${theme.colors.success};
          border-color: ${theme.colors.success};
          color: white;
          
          &:hover {
            background: #059669;
            border-color: #059669;
          }
        `;
      case 'warning':
        return `
          background: ${theme.colors.warning};
          border-color: ${theme.colors.warning};
          color: white;
          
          &:hover {
            background: #d97706;
            border-color: #d97706;
          }
        `;
      default:
        return `
          background: transparent;
          border-color: ${theme.colors.border};
          color: ${theme.colors.text};
          
          &:hover {
            background: ${theme.colors.surfaceHover};
            border-color: ${theme.colors.primary};
          }
        `;
    }
  }}
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const SubscriptionPlan = styled.div`
  .plan-info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: ${({ theme }) => theme.spacing.lg};
    padding: ${({ theme }) => theme.spacing.lg};
    background: ${({ theme }) => theme.colors.backgroundSecondary};
    border-radius: ${({ theme }) => theme.borderRadius.md};
    
    .plan-details {
      .name {
        font-size: ${({ theme }) => theme.fontSizes.lg};
        font-weight: ${({ theme }) => theme.fontWeights.semibold};
        color: ${({ theme }) => theme.colors.text};
        margin: 0 0 ${({ theme }) => theme.spacing.xs} 0;
      }
      
      .price {
        font-size: ${({ theme }) => theme.fontSizes.md};
        color: ${({ theme }) => theme.colors.textSecondary};
        margin: 0;
      }
    }
    
    .status {
      padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
      border-radius: ${({ theme }) => theme.borderRadius.full};
      font-size: ${({ theme }) => theme.fontSizes.sm};
      font-weight: ${({ theme }) => theme.fontWeights.medium};
      background: ${({ theme }) => theme.colors.success}20;
      color: ${({ theme }) => theme.colors.success};
    }
  }
`;

const TransactionList = styled.div`
  max-height: 400px;
  overflow-y: auto;
`;

const TransactionItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderLight};
  transition: ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    background: ${({ theme }) => theme.colors.backgroundSecondary};
  }
  
  &:last-child {
    border-bottom: none;
  }
  
  .transaction-info {
    .type {
      font-size: ${({ theme }) => theme.fontSizes.md};
      font-weight: ${({ theme }) => theme.fontWeights.medium};
      color: ${({ theme }) => theme.colors.text};
      margin: 0 0 ${({ theme }) => theme.spacing.xs} 0;
    }
    
    .date {
      font-size: ${({ theme }) => theme.fontSizes.sm};
      color: ${({ theme }) => theme.colors.textSecondary};
      margin: 0;
    }
  }
  
  .amount {
    font-size: ${({ theme }) => theme.fontSizes.md};
    font-weight: ${({ theme }) => theme.fontWeights.semibold};
    
    &.positive {
      color: ${({ theme }) => theme.colors.success};
    }
    
    &.negative {
      color: ${({ theme }) => theme.colors.error};
    }
  }
`;

const Modal = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: ${({ theme }) => theme.spacing.lg};
`;

const ModalContent = styled(motion.div)`
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.xl};
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  
  h3 {
    margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;
    font-size: ${({ theme }) => theme.fontSizes.xl};
    font-weight: ${({ theme }) => theme.fontWeights.semibold};
    color: ${({ theme }) => theme.colors.text};
  }
  
  p {
    margin: 0;
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

const FormGroup = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.md};
  
  label {
    display: block;
    font-size: ${({ theme }) => theme.fontSizes.sm};
    font-weight: ${({ theme }) => theme.fontWeights.medium};
    color: ${({ theme }) => theme.colors.text};
    margin-bottom: ${({ theme }) => theme.spacing.xs};
  }
  
  input, select {
    width: 100%;
    padding: ${({ theme }) => theme.spacing.md};
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.borderRadius.md};
    font-size: ${({ theme }) => theme.fontSizes.md};
    background: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.text};
    transition: ${({ theme }) => theme.transitions.fast};
    
    &:focus {
      outline: none;
      border-color: ${({ theme }) => theme.colors.primary};
      box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
    }
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.lg};
  
  button {
    flex: 1;
    margin-bottom: 0;
  }
`;

const FullWidthCard = styled(BillingCard)`
  grid-column: 1 / -1;
`;

const BillingPage: React.FC = () => {
  const { addNotification } = useNotifications();
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawMethod, setWithdrawMethod] = useState('bank');
  
  // Mock data - in real app, this would come from your store/API
  const walletBalance = 2847.50;
  const pendingPayouts = 425.75;
  const currentPlan = {
    name: 'Professional',
    price: '$29/month',
    status: 'Active',
    nextBilling: '2024-02-15'
  };
  
  const transactions = [
    { id: '1', type: 'Order Payment', date: '2024-01-14', amount: 45.50, positive: true },
    { id: '2', type: 'Subscription', date: '2024-01-15', amount: -29.00, positive: false },
    { id: '3', type: 'Order Payment', date: '2024-01-14', amount: 67.25, positive: true },
    { id: '4', type: 'Withdrawal', date: '2024-01-12', amount: -200.00, positive: false },
    { id: '5', type: 'Order Payment', date: '2024-01-11', amount: 32.75, positive: true },
    { id: '6', type: 'Order Payment', date: '2024-01-10', amount: 89.00, positive: true },
    { id: '7', type: 'Platform Fee', date: '2024-01-10', amount: -5.50, positive: false },
  ];
  
  const handleWithdraw = () => {
    const amount = parseFloat(withdrawAmount);
    if (amount <= 0 || amount > walletBalance) {
      addNotification({
        type: 'error',
        title: 'Invalid Amount',
        message: 'Please enter a valid amount within your available balance.'
      });
      return;
    }
    
    addNotification({
      type: 'success',
      title: 'Withdrawal Requested',
      message: `Your withdrawal of ${formatCurrency(amount)} has been submitted and will be processed within 2-3 business days.`
    });
    
    setShowWithdrawModal(false);
    setWithdrawAmount('');
  };
  
  const handleUpgradePlan = () => {
    addNotification({
      type: 'success',
      title: 'Plan Upgraded',
      message: 'Your subscription has been upgraded successfully!'
    });
    setShowUpgradeModal(false);
  };
  
  const handleCancelSubscription = () => {
    if (window.confirm('Are you sure you want to cancel your subscription? This will downgrade your account to the free plan.')) {
      addNotification({
        type: 'warning',
        title: 'Subscription Cancelled',
        message: 'Your subscription has been cancelled. You can reactivate it anytime.'
      });
    }
  };

  return (
    <BillingContainer>
      <Header>
        <h1>💳 Billing & Payments</h1>
        <p>
          Manage your subscription, wallet balance, and withdraw funds from your restaurant earnings.
        </p>
      </Header>

      <BillingGrid>
        {/* Wallet Balance */}
        <BillingCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <CardHeader>
            <CardIcon color="#10b98120">
              💰
            </CardIcon>
            <CardTitle>
              <h3>Wallet Balance</h3>
              <p>Available funds from your restaurant sales</p>
            </CardTitle>
          </CardHeader>
          
          <WalletBalance>
            <div className="amount">{formatCurrency(walletBalance)}</div>
            <div className="label">Available Balance</div>
          </WalletBalance>
          
          <div style={{ marginBottom: '16px', padding: '12px', background: 'var(--background-secondary)', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Pending Payouts</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'var(--warning)' }}>{formatCurrency(pendingPayouts)}</div>
          </div>
          
          <ActionButton 
            variant="success" 
            onClick={() => setShowWithdrawModal(true)}
            disabled={walletBalance <= 0}
          >
            💸 Withdraw Funds
          </ActionButton>
          
          <ActionButton variant="secondary">
            📊 View Earnings Report
          </ActionButton>
        </BillingCard>

        {/* Subscription Management */}
        <BillingCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <CardHeader>
            <CardIcon color="#2563eb20">
              📋
            </CardIcon>
            <CardTitle>
              <h3>Subscription</h3>
              <p>Manage your platform subscription plan</p>
            </CardTitle>
          </CardHeader>
          
          <SubscriptionPlan>
            <div className="plan-info">
              <div className="plan-details">
                <div className="name">{currentPlan.name} Plan</div>
                <div className="price">{currentPlan.price}</div>
              </div>
              <div className="status">{currentPlan.status}</div>
            </div>
          </SubscriptionPlan>
          
          <div style={{ marginBottom: '16px', fontSize: '14px', color: 'var(--text-secondary)' }}>
            Next billing date: {formatDate(currentPlan.nextBilling)}
          </div>
          
          <ActionButton 
            variant="primary" 
            onClick={() => setShowUpgradeModal(true)}
          >
            ⬆️ Upgrade Plan
          </ActionButton>
          
          <ActionButton variant="secondary">
            📄 View Invoices
          </ActionButton>
          
          <ActionButton 
            variant="warning" 
            onClick={handleCancelSubscription}
          >
            ❌ Cancel Subscription
          </ActionButton>
        </BillingCard>
      </BillingGrid>

      {/* Transaction History */}
      <FullWidthCard
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <CardHeader>
          <CardIcon color="#f59e0b20">
            📊
          </CardIcon>
          <CardTitle>
            <h3>Transaction History</h3>
            <p>Recent payments, withdrawals, and subscription charges</p>
          </CardTitle>
        </CardHeader>
        
        <TransactionList>
          {transactions.map((transaction) => (
            <TransactionItem key={transaction.id}>
              <div className="transaction-info">
                <div className="type">{transaction.type}</div>
                <div className="date">{formatDate(transaction.date)}</div>
              </div>
              <div className={`amount ${transaction.positive ? 'positive' : 'negative'}`}>
                {transaction.positive ? '+' : ''}{formatCurrency(Math.abs(transaction.amount))}
              </div>
            </TransactionItem>
          ))}
        </TransactionList>
      </FullWidthCard>

      {/* Withdraw Modal */}
      <AnimatePresence>
        {showWithdrawModal && (
          <Modal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => e.target === e.currentTarget && setShowWithdrawModal(false)}
          >
            <ModalContent
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <ModalHeader>
                <h3>💸 Withdraw Funds</h3>
                <p>Transfer money from your wallet to your bank account</p>
              </ModalHeader>
              
              <FormGroup>
                <label>Withdrawal Amount</label>
                <input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="0.00"
                  min="0"
                  max={walletBalance}
                  step="0.01"
                />
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Maximum: {formatCurrency(walletBalance)}
                </div>
              </FormGroup>
              
              <FormGroup>
                <label>Withdrawal Method</label>
                <select
                  value={withdrawMethod}
                  onChange={(e) => setWithdrawMethod(e.target.value)}
                >
                  <option value="bank">🏦 Bank Transfer</option>
                  <option value="paypal">💙 PayPal</option>
                  <option value="crypto">₿ Cryptocurrency</option>
                </select>
              </FormGroup>
              
              <div style={{ padding: '12px', background: 'var(--info)15', borderRadius: '8px', marginBottom: '16px' }}>
                <div style={{ fontSize: '14px', color: 'var(--info)' }}>
                  ℹ️ Processing time: 2-3 business days<br/>
                  Fee: Free for amounts over $100, $2.50 for smaller amounts
                </div>
              </div>
              
              <ButtonGroup>
                <ActionButton 
                  variant="secondary" 
                  onClick={() => setShowWithdrawModal(false)}
                >
                  Cancel
                </ActionButton>
                <ActionButton 
                  variant="success" 
                  onClick={handleWithdraw}
                >
                  Withdraw {withdrawAmount && formatCurrency(parseFloat(withdrawAmount) || 0)}
                </ActionButton>
              </ButtonGroup>
            </ModalContent>
          </Modal>
        )}
      </AnimatePresence>

      {/* Upgrade Plan Modal */}
      <AnimatePresence>
        {showUpgradeModal && (
          <Modal
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={(e) => e.target === e.currentTarget && setShowUpgradeModal(false)}
          >
            <ModalContent
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <ModalHeader>
                <h3>⬆️ Upgrade Your Plan</h3>
                <p>Get access to premium features and higher limits</p>
              </ModalHeader>
              
              <div style={{ display: 'grid', gap: '16px', marginBottom: '24px' }}>
                <div style={{ padding: '16px', border: '2px solid var(--primary)', borderRadius: '8px', background: 'var(--primary)10' }}>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '8px' }}>Enterprise Plan</div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: 'var(--primary)', marginBottom: '8px' }}>$99/month</div>
                  <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px', color: 'var(--text-secondary)' }}>
                    <li>Unlimited products and categories</li>
                    <li>Advanced analytics and reporting</li>
                    <li>Priority customer support</li>
                    <li>Custom branding options</li>
                    <li>API access for integrations</li>
                  </ul>
                </div>
              </div>
              
              <ButtonGroup>
                <ActionButton 
                  variant="secondary" 
                  onClick={() => setShowUpgradeModal(false)}
                >
                  Cancel
                </ActionButton>
                <ActionButton 
                  variant="primary" 
                  onClick={handleUpgradePlan}
                >
                  Upgrade Now
                </ActionButton>
              </ButtonGroup>
            </ModalContent>
          </Modal>
        )}
      </AnimatePresence>
    </BillingContainer>
  );
};

export default BillingPage;