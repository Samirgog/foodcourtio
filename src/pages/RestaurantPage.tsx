import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useRestaurantStore } from '../stores/restaurantStore';
import { useUIStore } from '../stores/uiStore';
import { Card, Button } from '../styles/theme';
import { FadeInUp } from '../components/animations/AnimationComponents';

const RestaurantContainer = styled.div`
  max-width: 800px;
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

const FormCard = styled(Card)`
  padding: ${({ theme }) => theme.spacing.xl};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    padding: ${({ theme }) => theme.spacing.lg};
  }
`;

const FormSection = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  
  &:last-child {
    margin-bottom: 0;
  }
  
  h3 {
    font-size: ${({ theme }) => theme.fontSizes.lg};
    font-weight: ${({ theme }) => theme.fontWeights.semibold};
    color: ${({ theme }) => theme.colors.text};
    margin: 0 0 ${({ theme }) => theme.spacing.lg} 0;
    padding-bottom: ${({ theme }) => theme.spacing.sm};
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  }
`;

const FormGroup = styled.div`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  
  label {
    display: block;
    font-weight: ${({ theme }) => theme.fontWeights.medium};
    color: ${({ theme }) => theme.colors.text};
    margin-bottom: ${({ theme }) => theme.spacing.sm};
    font-size: ${({ theme }) => theme.fontSizes.sm};
  }
  
  .required {
    color: ${({ theme }) => theme.colors.error};
  }
`;

const Input = styled.input`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSizes.md};
  transition: ${({ theme }) => theme.transitions.fast};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSizes.md};
  font-family: inherit;
  min-height: 100px;
  resize: vertical;
  transition: ${({ theme }) => theme.transitions.fast};
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 3px ${({ theme }) => theme.colors.primary}20;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ImageUploadContainer = styled.div`
  border: 2px dashed ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  padding: ${({ theme }) => theme.spacing.xl};
  text-align: center;
  transition: ${({ theme }) => theme.transitions.fast};
  cursor: pointer;
  
  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    background-color: ${({ theme }) => theme.colors.primaryLight};
  }
  
  &.dragover {
    border-color: ${({ theme }) => theme.colors.primary};
    background-color: ${({ theme }) => theme.colors.primaryLight};
  }
  
  .upload-icon {
    font-size: 3rem;
    color: ${({ theme }) => theme.colors.textMuted};
    margin-bottom: ${({ theme }) => theme.spacing.md};
  }
  
  .upload-text {
    color: ${({ theme }) => theme.colors.text};
    font-weight: ${({ theme }) => theme.fontWeights.medium};
    margin-bottom: ${({ theme }) => theme.spacing.sm};
  }
  
  .upload-hint {
    color: ${({ theme }) => theme.colors.textMuted};
    font-size: ${({ theme }) => theme.fontSizes.sm};
  }
`;

const ImagePreview = styled.div`
  position: relative;
  display: inline-block;
  margin-top: ${({ theme }) => theme.spacing.md};
  
  img {
    width: 200px;
    height: 120px;
    object-fit: cover;
    border-radius: ${({ theme }) => theme.borderRadius.md};
    border: 1px solid ${({ theme }) => theme.colors.border};
  }
`;

const RemoveImageButton = styled.button`
  position: absolute;
  top: -${({ theme }) => theme.spacing.sm};
  right: -${({ theme }) => theme.spacing.sm};
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: none;
  background-color: ${({ theme }) => theme.colors.error};
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  transition: ${({ theme }) => theme.transitions.fast};
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.error};
  }
`;

const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.colors.backgroundSecondary};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  
  .toggle-info {
    flex: 1;
    
    .title {
      font-weight: ${({ theme }) => theme.fontWeights.semibold};
      color: ${({ theme }) => theme.colors.text};
      margin: 0 0 ${({ theme }) => theme.spacing.xs} 0;
    }
    
    .description {
      color: ${({ theme }) => theme.colors.textMuted};
      font-size: ${({ theme }) => theme.fontSizes.sm};
      margin: 0;
    }
  }
`;

const ToggleSwitch = styled.label`
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
  
  input {
    opacity: 0;
    width: 0;
    height: 0;
  }
  
  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: ${({ theme }) => theme.colors.border};
    transition: 0.4s;
    border-radius: 34px;
    
    &:before {
      position: absolute;
      content: "";
      height: 26px;
      width: 26px;
      left: 4px;
      bottom: 4px;
      background-color: white;
      transition: 0.4s;
      border-radius: 50%;
    }
  }
  
  input:checked + .slider {
    background-color: ${({ theme }) => theme.colors.success};
  }
  
  input:checked + .slider:before {
    transform: translateX(26px);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  justify-content: flex-end;
  margin-top: ${({ theme }) => theme.spacing.xl};
  padding-top: ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
  }
`;

const SaveButton = styled(Button)`
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.accent});
  animation: pulse 2s ease-in-out infinite alternate;
  
  @keyframes pulse {
    0% {
      box-shadow: 0 0 0 0 ${({ theme }) => theme.colors.primary}40;
    }
    100% {
      box-shadow: 0 0 0 10px transparent;
    }
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px ${({ theme }) => theme.colors.primary}40;
  }
`;

const HiddenFileInput = styled.input`
  display: none;
`;

interface RestaurantFormData {
  name: string;
  description: string;
  image: File | null;
  isActive: boolean;
}

const RestaurantPage: React.FC = () => {
  const { currentRestaurant, updateRestaurant, isLoading, fetchRestaurants, setCurrentRestaurant } = useRestaurantStore();
  const { addNotification } = useUIStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState<RestaurantFormData>({
    name: '',
    description: '',
    image: null,
    isActive: true,
  });
  
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // Initialize restaurant data on component mount
  useEffect(() => {
    const initializeData = async () => {
      await fetchRestaurants();
    };
    initializeData();
  }, [fetchRestaurants]);

  // Load current restaurant data or set default from store
  useEffect(() => {
    const restaurantStore = useRestaurantStore.getState();
    if (!currentRestaurant && restaurantStore.restaurants.length > 0) {
      setCurrentRestaurant(restaurantStore.restaurants[0]);
    }
  }, [currentRestaurant, setCurrentRestaurant]);

  // Update form when restaurant data changes
  useEffect(() => {
    if (currentRestaurant) {
      setFormData({
        name: currentRestaurant.name,
        description: currentRestaurant.description,
        image: null,
        isActive: currentRestaurant.isPublished,
      });
      
      if (currentRestaurant.logo) {
        setImagePreview(currentRestaurant.logo);
      }
    }
  }, [currentRestaurant]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleToggleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, isActive: e.target.checked }));
  };

  const handleImageSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      setFormData(prev => ({ ...prev, image: file }));
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      addNotification({
        type: 'error',
        title: 'Invalid File',
        message: 'Please select a valid image file.',
      });
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleImageSelect(file);
    }
  };

  const handleRemoveImage = () => {
    setFormData(prev => ({ ...prev, image: null }));
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      addNotification({
        type: 'error',
        title: 'Validation Error',
        message: 'Restaurant name is required.',
      });
      return;
    }

    if (!currentRestaurant) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'No restaurant selected to update.',
      });
      return;
    }

    try {
      const updates: any = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        isPublished: formData.isActive,
      };

      // In a real app, you would upload the image to a server first
      if (formData.image) {
        // Simulate image URL - in real app, this would be the uploaded image URL
        updates.logo = imagePreview;
      }

      await updateRestaurant(currentRestaurant.id, updates);
      
      addNotification({
        type: 'success',
        title: 'Success',
        message: 'Restaurant settings updated successfully!',
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to update restaurant settings. Please try again.',
      });
    }
  };

  const handleReset = () => {
    if (currentRestaurant) {
      setFormData({
        name: currentRestaurant.name,
        description: currentRestaurant.description,
        image: null,
        isActive: currentRestaurant.isPublished,
      });
      
      if (currentRestaurant.logo) {
        setImagePreview(currentRestaurant.logo);
      } else {
        setImagePreview(null);
      }
      
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <RestaurantContainer>
      <FadeInUp>
        <Header>
          <h1>🏪 Restaurant Setup</h1>
          <p>
            Configure your restaurant details, upload images, and manage your restaurant's status.
            Make sure to save your changes when you're done.
          </p>
        </Header>

        <FormCard>
          <form onSubmit={handleSubmit}>
            <FormSection>
              <h3>Basic Information</h3>
              
              <FormGroup>
                <label htmlFor="name">
                  Restaurant Name <span className="required">*</span>
                </label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your restaurant name"
                  disabled={isLoading}
                  required
                />
              </FormGroup>

              <FormGroup>
                <label htmlFor="description">Restaurant Description</label>
                <TextArea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your restaurant, cuisine type, specialties, etc."
                  disabled={isLoading}
                />
              </FormGroup>
            </FormSection>

            <FormSection>
              <h3>Restaurant Image</h3>
              
              <FormGroup>
                <label>Logo / Banner Image</label>
                <ImageUploadContainer
                  className={isDragOver ? 'dragover' : ''}
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <div className="upload-icon">📷</div>
                  <div className="upload-text">Click to upload or drag and drop</div>
                  <div className="upload-hint">PNG, JPG, GIF up to 10MB</div>
                </ImageUploadContainer>
                
                <HiddenFileInput
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileInputChange}
                />
                
                {imagePreview && (
                  <ImagePreview>
                    <img src={imagePreview} alt="Restaurant preview" />
                    <RemoveImageButton onClick={handleRemoveImage} type="button">
                      ×
                    </RemoveImageButton>
                  </ImagePreview>
                )}
              </FormGroup>
            </FormSection>

            <FormSection>
              <h3>Restaurant Status</h3>
              
              <ToggleContainer>
                <div className="toggle-info">
                  <div className="title">Restaurant Active</div>
                  <div className="description">
                    When active, your restaurant will be visible to customers and can receive orders.
                    Turn off to temporarily disable your restaurant.
                  </div>
                </div>
                
                <ToggleSwitch>
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={handleToggleChange}
                    disabled={isLoading}
                  />
                  <span className="slider"></span>
                </ToggleSwitch>
              </ToggleContainer>
            </FormSection>

            <ButtonGroup>
              <Button
                type="button"
                variant="secondary"
                onClick={handleReset}
                disabled={isLoading}
              >
                Reset Changes
              </Button>
              
              <SaveButton
                type="submit"
                disabled={isLoading || !formData.name.trim()}
              >
                {isLoading ? 'Saving...' : 'Save Changes'}
              </SaveButton>
            </ButtonGroup>
          </form>
        </FormCard>
      </FadeInUp>
    </RestaurantContainer>
  );
};

export default RestaurantPage;