import React, { useState } from 'react';
import styled from 'styled-components';
import { useForm } from 'react-hook-form';
import { useCatalogStore, useNotifications } from '../stores';
import { AIGeneratorRequest } from '../types';
import { Card, Button, Input, Label, ErrorText, Textarea, Grid } from '../styles/theme';

interface AIGeneratorProps {
  show: boolean;
  onClose: () => void;
}

const ModalOverlay = styled.div<{ show: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: ${({ show }) => show ? 'flex' : 'none'};
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: ${({ theme }) => theme.spacing.lg};
`;

const GeneratorCard = styled(Card)`
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  padding: ${({ theme }) => theme.spacing.xl};
  
  .header {
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.md};
    margin-bottom: ${({ theme }) => theme.spacing.lg};
    
    .icon {
      font-size: 2rem;
    }
    
    .title {
      flex: 1;
      
      h2 {
        margin: 0;
        color: ${({ theme }) => theme.colors.text};
      }
      
      p {
        margin: ${({ theme }) => theme.spacing.xs} 0 0 0;
        color: ${({ theme }) => theme.colors.textSecondary};
        font-size: ${({ theme }) => theme.fontSizes.sm};
      }
    }
  }
  
  .form-group {
    margin-bottom: ${({ theme }) => theme.spacing.lg};
    
    &:last-child {
      margin-bottom: 0;
    }
  }
`;

const PromptTextarea = styled(Textarea)`
  min-height: 120px;
  font-size: ${({ theme }) => theme.fontSizes.md};
  line-height: 1.6;
`;

const ExamplePrompts = styled.div`
  margin-top: ${({ theme }) => theme.spacing.md};
  
  .examples-title {
    font-size: ${({ theme }) => theme.fontSizes.sm};
    font-weight: ${({ theme }) => theme.fontWeights.medium};
    color: ${({ theme }) => theme.colors.text};
    margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;
  }
  
  .example {
    background: ${({ theme }) => theme.colors.backgroundSecondary};
    border: 1px solid ${({ theme }) => theme.colors.border};
    border-radius: ${({ theme }) => theme.borderRadius.sm};
    padding: ${({ theme }) => theme.spacing.sm};
    margin-bottom: ${({ theme }) => theme.spacing.xs};
    cursor: pointer;
    transition: ${({ theme }) => theme.transitions.fast};
    font-size: ${({ theme }) => theme.fontSizes.sm};
    
    &:hover {
      background: ${({ theme }) => theme.colors.backgroundTertiary};
      border-color: ${({ theme }) => theme.colors.primary};
    }
    
    &:last-child {
      margin-bottom: 0;
    }
  }
`;

const GenerationProgress = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.backgroundSecondary};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  margin: ${({ theme }) => theme.spacing.lg} 0;
  
  .spinner {
    width: 24px;
    height: 24px;
    border: 2px solid ${({ theme }) => theme.colors.border};
    border-top: 2px solid ${({ theme }) => theme.colors.primary};
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  .text {
    color: ${({ theme }) => theme.colors.text};
    font-weight: ${({ theme }) => theme.fontWeights.medium};
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
  justify-content: flex-end;
  margin-top: ${({ theme }) => theme.spacing.xl};
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
  }
`;

const examplePrompts = [
  "Create a menu for an Italian restaurant with appetizers, pasta, pizza, and desserts",
  "Generate categories for a healthy juice bar with smoothies, cold-pressed juices, and acai bowls",
  "Build a fast food menu with burgers, sides, drinks, and combos",
  "Create a coffee shop menu with hot drinks, cold drinks, pastries, and sandwiches",
  "Generate a sushi restaurant menu with rolls, nigiri, sashimi, and appetizers",
  "Build a Mexican restaurant menu with tacos, burritos, quesadillas, and sides"
];

export const AICatalogGenerator: React.FC<AIGeneratorProps> = ({ show, onClose }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { generateCatalogWithAI, aiGenerating } = useCatalogStore();
  const { showSuccess, showError } = useNotifications();
  
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<AIGeneratorRequest>();
  
  const promptValue = watch('prompt');
  
  const handleExampleClick = (example: string) => {
    setValue('prompt', example);
  };
  
  const onSubmit = async (data: AIGeneratorRequest) => {
    if (!data.prompt.trim()) {
      showError('Missing Input', 'Please enter a prompt describing your menu');
      return;
    }
    
    setIsGenerating(true);
    
    try {
      await generateCatalogWithAI({
        prompt: data.prompt,
        restaurantType: data.restaurantType || undefined,
        numberOfCategories: data.numberOfCategories || 4,
        itemsPerCategory: data.itemsPerCategory || 5
      });
      
      showSuccess(
        'AI Generation Complete!', 
        'New categories and products have been generated and added to your catalog'
      );
      
      onClose();
    } catch (error) {
      showError(
        'Generation Failed', 
        'Failed to generate catalog. Please try again with a different prompt.'
      );
    } finally {
      setIsGenerating(false);
    }
  };
  
  return (
    <ModalOverlay show={show}>
      <GeneratorCard>
        <div className="header">
          <span className="icon">🤖</span>
          <div className="title">
            <h2>AI Catalog Generator</h2>
            <p>Generate menu categories and products using natural language</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            disabled={isGenerating}
          >
            ✕
          </Button>
        </div>
        
        {isGenerating && (
          <GenerationProgress>
            <div className="spinner"></div>
            <span className="text">AI is generating your catalog...</span>
          </GenerationProgress>
        )}
        
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <Label>Describe Your Menu *</Label>
            <PromptTextarea
              {...register('prompt', { 
                required: 'Please describe what kind of menu you want to generate',
                minLength: { value: 10, message: 'Please provide a more detailed description' }
              })}
              placeholder="Describe the type of restaurant and menu items you want to generate. Be specific about cuisine type, categories, and any special requirements..."
              disabled={isGenerating}
            />
            {errors.prompt && <ErrorText>{errors.prompt.message}</ErrorText>}
            
            <ExamplePrompts>
              <p className="examples-title">Click an example to get started:</p>
              {examplePrompts.map((example, index) => (
                <div
                  key={index}
                  className="example"
                  onClick={() => !isGenerating && handleExampleClick(example)}
                >
                  {example}
                </div>
              ))}
            </ExamplePrompts>
          </div>
          
          <Grid columns={3} gap="1rem">
            <div className="form-group">
              <Label>Restaurant Type (Optional)</Label>
              <Input
                {...register('restaurantType')}
                placeholder="e.g., Italian, Fast Food, Cafe"
                disabled={isGenerating}
              />
            </div>
            
            <div className="form-group">
              <Label>Number of Categories</Label>
              <Input
                type="number"
                min="2"
                max="10"
                {...register('numberOfCategories', { valueAsNumber: true })}
                placeholder="4"
                disabled={isGenerating}
              />
            </div>
            
            <div className="form-group">
              <Label>Items per Category</Label>
              <Input
                type="number"
                min="2"
                max="15"
                {...register('itemsPerCategory', { valueAsNumber: true })}
                placeholder="5"
                disabled={isGenerating}
              />
            </div>
          </Grid>
          
          <div className="form-group">
            <div style={{ 
              background: '#f8f9fa', 
              border: '1px solid #e9ecef', 
              borderRadius: '8px', 
              padding: '1rem',
              fontSize: '0.875rem',
              color: '#6c757d'
            }}>
              <strong>💡 Pro Tips:</strong>
              <ul style={{ margin: '0.5rem 0 0 1.5rem', paddingLeft: 0 }}>
                <li>Be specific about cuisine type and style</li>
                <li>Mention any dietary requirements (vegan, gluten-free, etc.)</li>
                <li>Include price ranges if you have preferences</li>
                <li>Specify any special categories you want included</li>
              </ul>
            </div>
          </div>
          
          <ActionButtons>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isGenerating}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isGenerating || !promptValue?.trim()}
            >
              {isGenerating ? 'Generating...' : '🤖 Generate Catalog'}
            </Button>
          </ActionButtons>
        </form>
      </GeneratorCard>
    </ModalOverlay>
  );
};