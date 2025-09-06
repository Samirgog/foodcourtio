import React, { useState } from 'react';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { useRestaurantStore, useNotifications } from '../stores';
import { FoodCourtSelection } from '../components/FoodCourtSelection';
import { RestaurantFormData, FoodCourt, PaymentProvider } from '../types';
import { Card, Button, Input, Label, ErrorText, Textarea, Select, Grid, Flex } from '../styles/theme';
import { validateImageFile, createImageUrl } from '../utils';

const RestaurantContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;

const StepIndicator = styled.div`
  display: flex;
  justify-content: center;
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  
  .step {
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.sm};
    
    .number {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: ${({ theme }) => theme.fontWeights.bold};
      font-size: ${({ theme }) => theme.fontSizes.sm};
      
      &.active {
        background-color: ${({ theme }) => theme.colors.primary};
        color: white;
      }
      
      &.completed {
        background-color: ${({ theme }) => theme.colors.success};
        color: white;
      }
      
      &.pending {
        background-color: ${({ theme }) => theme.colors.border};
        color: ${({ theme }) => theme.colors.textMuted};
      }
    }
    
    .label {
      font-size: ${({ theme }) => theme.fontSizes.sm};
      color: ${({ theme }) => theme.colors.textSecondary};
      
      &.active {
        color: ${({ theme }) => theme.colors.text};
        font-weight: ${({ theme }) => theme.fontWeights.medium};
      }
    }
    
    &:not(:last-child)::after {
      content: '';
      width: 40px;
      height: 2px;
      background-color: ${({ theme }) => theme.colors.border};
      margin: 0 ${({ theme }) => theme.spacing.md};
    }
  }
`;

const FormCard = styled(Card)`
  padding: ${({ theme }) => theme.spacing.xl};
  
  h2 {
    margin: 0 0 ${({ theme }) => theme.spacing.lg} 0;
    color: ${({ theme }) => theme.colors.text};
    font-size: ${({ theme }) => theme.fontSizes.xxl};
  }
  
  .form-group {
    margin-bottom: ${({ theme }) => theme.spacing.lg};
    
    &:last-child {
      margin-bottom: 0;
    }
  }
`;

const ImageUpload = styled.div`
  border: 2px dashed ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.normal};
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    background-color: ${({ theme }) => theme.colors.backgroundTertiary};
  }
  
  &.has-image {
    padding: 0;
    
    img {
      width: 100%;
      height: 200px;
      object-fit: cover;
      border-radius: ${({ theme }) => theme.borderRadius.lg};
    }
  }
  
  .upload-content {
    .icon {
      font-size: 3rem;
      margin-bottom: ${({ theme }) => theme.spacing.md};
      opacity: 0.6;
    }
    
    .title {
      font-size: ${({ theme }) => theme.fontSizes.lg};
      font-weight: ${({ theme }) => theme.fontWeights.medium};
      color: ${({ theme }) => theme.colors.text};
      margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;
    }
    
    .subtitle {
      color: ${({ theme }) => theme.colors.textMuted};
      font-size: ${({ theme }) => theme.fontSizes.sm};
      margin: 0;
    }
  }
  
  input[type="file"] {
    display: none;
  }
`;

const PaymentProviderCard = styled.div<{ selected: boolean }>`
  border: 2px solid ${({ selected, theme }) => 
    selected ? theme.colors.primary : theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.normal};
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
  }
  
  .header {
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.md};
    margin-bottom: ${({ theme }) => theme.spacing.md};
    
    .logo {
      width: 40px;
      height: 40px;
      border-radius: ${({ theme }) => theme.borderRadius.sm};
      object-fit: contain;
    }
    
    .name {
      font-weight: ${({ theme }) => theme.fontWeights.semibold};
      color: ${({ theme }) => theme.colors.text};
      margin: 0;
    }
  }
  
  .description {
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: ${({ theme }) => theme.fontSizes.sm};
    margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;
  }
  
  .fees {
    font-size: ${({ theme }) => theme.fontSizes.sm};
    color: ${({ theme }) => theme.colors.textMuted};
    margin: 0;
  }
`;

const ActionBar = styled.div`
  display: flex;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.xl};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
  }
`;

type Step = 'foodcourt' | 'details' | 'payment' | 'location';

const RestaurantCreationPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<Step>('foodcourt');
  const [selectedFoodCourt, setSelectedFoodCourt] = useState<FoodCourt | null>(null);
  const [selectedPaymentProvider, setSelectedPaymentProvider] = useState<PaymentProvider | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  
  const { createRestaurant, paymentProviders, fetchPaymentProviders, isLoading } = useRestaurantStore();
  const { showSuccess, showError } = useNotifications();
  
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<RestaurantFormData>();

  React.useEffect(() => {
    fetchPaymentProviders();
  }, [fetchPaymentProviders]);

  const steps = [
    { key: 'foodcourt', label: 'Choose Location', number: 1 },
    { key: 'details', label: 'Restaurant Details', number: 2 },
    { key: 'payment', label: 'Payment Setup', number: 3 },
    { key: 'location', label: 'Specific Location', number: 4 }
  ];

  const getStepStatus = (step: string) => {
    const currentIndex = steps.findIndex(s => s.key === currentStep);
    const stepIndex = steps.findIndex(s => s.key === step);
    
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'active';
    return 'pending';
  };

  const handleImageUpload = (file: File, type: 'logo' | 'banner') => {
    const validation = validateImageFile(file);
    if (!validation.valid) {
      showError('Invalid Image', validation.error!);
      return;
    }
    
    if (type === 'logo') {
      setLogoFile(file);
    } else {
      setBannerFile(file);
    }
  };

  const onSubmit = async (data: RestaurantFormData) => {
    if (!selectedFoodCourt) {
      showError('Missing Information', 'Please select a food court');
      return;
    }

    try {
      const formData = {
        ...data,
        foodCourtId: selectedFoodCourt.id,
        paymentProviderId: selectedPaymentProvider?.id,
        logo: logoFile,
        banner: bannerFile,
        themeId: 'modern' // Default theme
      };

      await createRestaurant(formData);
      showSuccess('Success!', 'Restaurant created successfully');
    } catch (error) {
      showError('Creation Failed', 'Failed to create restaurant');
    }
  };

  const renderFoodCourtStep = () => (
    <FoodCourtSelection
      onSelect={(foodCourt) => {
        setSelectedFoodCourt(foodCourt);
        setCurrentStep('details');
      }}
      selectedId={selectedFoodCourt?.id}
    />
  );

  const renderDetailsStep = () => (
    <FormCard>
      <h2>Restaurant Details</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="form-group">
          <Label>Restaurant Name *</Label>
          <Input
            {...register('name', { required: 'Restaurant name is required' })}
            placeholder="Enter your restaurant name"
          />
          {errors.name && <ErrorText>{errors.name.message}</ErrorText>}
        </div>

        <div className="form-group">
          <Label>Description *</Label>
          <Textarea
            {...register('description', { required: 'Description is required' })}
            placeholder="Describe your restaurant and cuisine..."
            rows={4}
          />
          {errors.description && <ErrorText>{errors.description.message}</ErrorText>}
        </div>

        <Grid columns={2} gap="1.5rem">
          <div className="form-group">
            <Label>Logo</Label>
            <ImageUpload 
              className={logoFile ? 'has-image' : ''}
              onClick={() => document.getElementById('logo-upload')?.click()}
            >
              {logoFile ? (
                <img src={createImageUrl(logoFile)} alt="Logo preview" />
              ) : (
                <div className="upload-content">
                  <div className="icon">📷</div>
                  <h3 className="title">Upload Logo</h3>
                  <p className="subtitle">PNG, JPG up to 5MB</p>
                </div>
              )}
              <input
                id="logo-upload"
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'logo')}
              />
            </ImageUpload>
          </div>

          <div className="form-group">
            <Label>Banner Image</Label>
            <ImageUpload 
              className={bannerFile ? 'has-image' : ''}
              onClick={() => document.getElementById('banner-upload')?.click()}
            >
              {bannerFile ? (
                <img src={createImageUrl(bannerFile)} alt="Banner preview" />
              ) : (
                <div className="upload-content">
                  <div className="icon">🖼️</div>
                  <h3 className="title">Upload Banner</h3>
                  <p className="subtitle">PNG, JPG up to 5MB</p>
                </div>
              )}
              <input
                id="banner-upload"
                type="file"
                accept="image/*"
                onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0], 'banner')}
              />
            </ImageUpload>
          </div>
        </Grid>
      </form>
    </FormCard>
  );

  const renderPaymentStep = () => (
    <FormCard>
      <h2>Payment Provider</h2>
      <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)' }}>
        Choose a payment provider to handle transactions for your restaurant.
      </p>
      
      <Grid columns={1} gap="1rem">
        {paymentProviders.map((provider) => (
          <PaymentProviderCard
            key={provider.id}
            selected={selectedPaymentProvider?.id === provider.id}
            onClick={() => setSelectedPaymentProvider(provider)}
          >
            <div className="header">
              <img src={provider.logo} alt={provider.name} className="logo" />
              <h3 className="name">{provider.name}</h3>
            </div>
            <p className="description">{provider.description}</p>
            <p className="fees">
              Fees: {provider.fees.percentage}%
              {provider.fees.fixedFee && ` + $${provider.fees.fixedFee}`} per transaction
            </p>
          </PaymentProviderCard>
        ))}
      </Grid>
    </FormCard>
  );

  const renderLocationStep = () => (
    <FormCard>
      <h2>Specific Location</h2>
      <p style={{ marginBottom: '2rem', color: 'var(--text-secondary)' }}>
        Specify your exact location within {selectedFoodCourt?.name}.
      </p>
      
      <Grid columns={3} gap="1rem">
        <div className="form-group">
          <Label>Floor</Label>
          <Select {...register('location.floor', { valueAsNumber: true })}>
            <option value={1}>Ground Floor</option>
            <option value={2}>Second Floor</option>
            <option value={3}>Third Floor</option>
          </Select>
        </div>
        
        <div className="form-group">
          <Label>Section</Label>
          <Select {...register('location.section')}>
            <option value="A">Section A</option>
            <option value="B">Section B</option>
            <option value="C">Section C</option>
            <option value="D">Section D</option>
          </Select>
        </div>
        
        <div className="form-group">
          <Label>Spot Number (Optional)</Label>
          <Input
            {...register('location.spotNumber')}
            placeholder="e.g., 12A"
          />
        </div>
      </Grid>
    </FormCard>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'foodcourt':
        return renderFoodCourtStep();
      case 'details':
        return renderDetailsStep();
      case 'payment':
        return renderPaymentStep();
      case 'location':
        return renderLocationStep();
      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 'foodcourt':
        return !!selectedFoodCourt;
      case 'details':
        return !!watch('name') && !!watch('description');
      case 'payment':
        return true; // Payment provider is optional
      case 'location':
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    const currentIndex = steps.findIndex(s => s.key === currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].key as Step);
    }
  };

  const handlePrevious = () => {
    const currentIndex = steps.findIndex(s => s.key === currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].key as Step);
    }
  };

  const isLastStep = currentStep === 'location';

  return (
    <RestaurantContainer>
      <StepIndicator>
        {steps.map((step) => (
          <div key={step.key} className="step">
            <div className={`number ${getStepStatus(step.key)}`}>
              {getStepStatus(step.key) === 'completed' ? '✓' : step.number}
            </div>
            <span className={`label ${getStepStatus(step.key)}`}>
              {step.label}
            </span>
          </div>
        ))}
      </StepIndicator>

      {renderCurrentStep()}

      {currentStep !== 'foodcourt' && (
        <ActionBar>
          <Button 
            variant="outline" 
            onClick={handlePrevious}
            disabled={isLoading}
          >
            ← Previous
          </Button>
          
          {isLastStep ? (
            <Button 
              onClick={handleSubmit(onSubmit)}
              disabled={!canProceed() || isLoading}
            >
              {isLoading ? 'Creating...' : 'Create Restaurant'}
            </Button>
          ) : (
            <Button 
              onClick={handleNext}
              disabled={!canProceed()}
            >
              Next →
            </Button>
          )}
        </ActionBar>
      )}
    </RestaurantContainer>
  );
};

export default RestaurantCreationPage;