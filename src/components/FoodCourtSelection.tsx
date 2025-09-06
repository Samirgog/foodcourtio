import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useRestaurantStore, useNotifications } from '../stores';
import { FoodCourt } from '../types';
import { Card, Button, Input, Label, Grid, Flex } from '../styles/theme';
import { useDebounce } from '../hooks';

const SelectionContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const SearchSection = styled(Card)`
  padding: ${({ theme }) => theme.spacing.xl};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
  
  h2 {
    margin: 0 0 ${({ theme }) => theme.spacing.lg} 0;
    color: ${({ theme }) => theme.colors.text};
    font-size: ${({ theme }) => theme.fontSizes.xxl};
    font-weight: ${({ theme }) => theme.fontWeights.semibold};
  }
  
  p {
    margin: 0 0 ${({ theme }) => theme.spacing.xl} 0;
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: ${({ theme }) => theme.fontSizes.lg};
  }
`;

const FilterBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: end;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.md}) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const FilterGroup = styled.div`
  flex: 1;
  min-width: 200px;
`;

const SortSelect = styled.select`
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSizes.md};
  cursor: pointer;
  
  &:focus {
    outline: 2px solid ${({ theme }) => theme.colors.primary};
    outline-offset: 2px;
  }
`;

const FoodCourtCard = styled(Card)<{ selected: boolean }>`
  padding: ${({ theme }) => theme.spacing.xl};
  cursor: pointer;
  transition: ${({ theme }) => theme.transitions.normal};
  border: 2px solid ${({ selected, theme }) => 
    selected ? theme.colors.primary : 'transparent'};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadows.lg};
    border-color: ${({ theme }) => theme.colors.primary};
  }
  
  .image {
    width: 100%;
    height: 200px;
    border-radius: ${({ theme }) => theme.borderRadius.lg};
    object-fit: cover;
    margin-bottom: ${({ theme }) => theme.spacing.lg};
  }
  
  .header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: ${({ theme }) => theme.spacing.md};
    
    h3 {
      margin: 0;
      font-size: ${({ theme }) => theme.fontSizes.xl};
      font-weight: ${({ theme }) => theme.fontWeights.semibold};
      color: ${({ theme }) => theme.colors.text};
    }
    
    .badge {
      padding: ${({ theme }) => theme.spacing.xs} ${({ theme }) => theme.spacing.sm};
      border-radius: ${({ theme }) => theme.borderRadius.full};
      background-color: ${({ theme }) => theme.colors.success};
      color: white;
      font-size: ${({ theme }) => theme.fontSizes.xs};
      font-weight: ${({ theme }) => theme.fontWeights.medium};
      white-space: nowrap;
    }
  }
  
  .location {
    color: ${({ theme }) => theme.colors.textMuted};
    margin-bottom: ${({ theme }) => theme.spacing.sm};
    font-size: ${({ theme }) => theme.fontSizes.sm};
  }
  
  .description {
    color: ${({ theme }) => theme.colors.textSecondary};
    margin-bottom: ${({ theme }) => theme.spacing.lg};
    line-height: 1.6;
  }
  
  .stats {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: ${({ theme }) => theme.spacing.md};
    border-top: 1px solid ${({ theme }) => theme.colors.border};
    
    .stat {
      text-align: center;
      
      .value {
        font-size: ${({ theme }) => theme.fontSizes.lg};
        font-weight: ${({ theme }) => theme.fontWeights.semibold};
        color: ${({ theme }) => theme.colors.text};
        margin: 0;
      }
      
      .label {
        font-size: ${({ theme }) => theme.fontSizes.xs};
        color: ${({ theme }) => theme.colors.textMuted};
        margin: 0;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
    }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${({ theme }) => theme.spacing.xxxl};
  
  .icon {
    font-size: 4rem;
    margin-bottom: ${({ theme }) => theme.spacing.lg};
    opacity: 0.5;
  }
  
  h3 {
    margin: 0 0 ${({ theme }) => theme.spacing.md} 0;
    color: ${({ theme }) => theme.colors.text};
  }
  
  p {
    color: ${({ theme }) => theme.colors.textMuted};
    margin: 0;
  }
`;

const ActionBar = styled.div`
  position: sticky;
  bottom: 0;
  background-color: ${({ theme }) => theme.colors.surface};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => theme.spacing.lg};
  margin: ${({ theme }) => theme.spacing.xl} -${({ theme }) => theme.spacing.lg} 0;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    margin-left: -${({ theme }) => theme.spacing.md};
    margin-right: -${({ theme }) => theme.spacing.md};
  }
`;

interface FoodCourtSelectionProps {
  onSelect: (foodCourt: FoodCourt) => void;
  selectedId?: string;
}

export const FoodCourtSelection: React.FC<FoodCourtSelectionProps> = ({
  onSelect,
  selectedId
}) => {
  const { foodCourts, fetchFoodCourts } = useRestaurantStore();
  const { showError } = useNotifications();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'location' | 'spots'>('name');
  const [filterByAvailability, setFilterByAvailability] = useState(false);
  
  const debouncedSearch = useDebounce(searchQuery, 300);

  useEffect(() => {
    fetchFoodCourts().catch(() => {
      showError('Error', 'Failed to load food courts');
    });
  }, [fetchFoodCourts, showError]);

  // Filter and sort food courts
  const filteredFoodCourts = React.useMemo(() => {
    let filtered = foodCourts.filter(fc => {
      const matchesSearch = fc.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                           fc.location.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                           fc.description.toLowerCase().includes(debouncedSearch.toLowerCase());
      
      const hasAvailability = !filterByAvailability || fc.availableSpots > 0;
      
      return matchesSearch && hasAvailability;
    });

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'location':
          return a.location.localeCompare(b.location);
        case 'spots':
          return b.availableSpots - a.availableSpots;
        default:
          return 0;
      }
    });

    return filtered;
  }, [foodCourts, debouncedSearch, sortBy, filterByAvailability]);

  const selectedFoodCourt = foodCourts.find(fc => fc.id === selectedId);

  const handleSelect = (foodCourt: FoodCourt) => {
    if (foodCourt.availableSpots <= 0) {
      showError('No Spots Available', 'This food court is currently full');
      return;
    }
    onSelect(foodCourt);
  };

  return (
    <SelectionContainer>
      <SearchSection>
        <h2>Choose Your Food Court</h2>
        <p>Select the perfect location for your restaurant from our available food courts</p>
        
        <FilterBar>
          <FilterGroup>
            <Label>Search Food Courts</Label>
            <Input
              type="text"
              placeholder="Search by name, location, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </FilterGroup>
          
          <FilterGroup style={{ maxWidth: '200px' }}>
            <Label>Sort by</Label>
            <SortSelect 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value as any)}
            >
              <option value="name">Name (A-Z)</option>
              <option value="location">Location</option>
              <option value="spots">Available Spots</option>
            </SortSelect>
          </FilterGroup>
          
          <FilterGroup style={{ maxWidth: '200px' }}>
            <Label>
              <input
                type="checkbox"
                checked={filterByAvailability}
                onChange={(e) => setFilterByAvailability(e.target.checked)}
                style={{ marginRight: '8px' }}
              />
              Available Only
            </Label>
          </FilterGroup>
        </FilterBar>
      </SearchSection>

      {filteredFoodCourts.length === 0 ? (
        <EmptyState>
          <div className="icon">🏢</div>
          <h3>No Food Courts Found</h3>
          <p>Try adjusting your search criteria or filters</p>
        </EmptyState>
      ) : (
        <Grid columns={3} gap="1.5rem" responsive>
          {filteredFoodCourts.map((foodCourt) => (
            <FoodCourtCard
              key={foodCourt.id}
              selected={foodCourt.id === selectedId}
              onClick={() => handleSelect(foodCourt)}
            >
              <img 
                src={foodCourt.imageUrl} 
                alt={foodCourt.name}
                className="image"
              />
              
              <div className="header">
                <h3>{foodCourt.name}</h3>
                {foodCourt.availableSpots > 0 && (
                  <span className="badge">
                    {foodCourt.availableSpots} spots
                  </span>
                )}
              </div>
              
              <div className="location">📍 {foodCourt.location}</div>
              <div className="description">{foodCourt.description}</div>
              
              <div className="stats">
                <div className="stat">
                  <p className="value">{foodCourt.totalRestaurants}</p>
                  <p className="label">Total Restaurants</p>
                </div>
                <div className="stat">
                  <p className="value">{foodCourt.availableSpots}</p>
                  <p className="label">Available</p>
                </div>
                <div className="stat">
                  <p className="value">
                    {Math.round((1 - foodCourt.availableSpots / foodCourt.totalRestaurants) * 100)}%
                  </p>
                  <p className="label">Occupied</p>
                </div>
              </div>
            </FoodCourtCard>
          ))}
        </Grid>
      )}

      {selectedFoodCourt && (
        <ActionBar>
          <Flex justify="between" align="center">
            <div>
              <strong>Selected: {selectedFoodCourt.name}</strong>
              <br />
              <span style={{ color: 'var(--text-muted)' }}>
                {selectedFoodCourt.location}
              </span>
            </div>
            <Button>
              Continue with {selectedFoodCourt.name} →
            </Button>
          </Flex>
        </ActionBar>
      )}
    </SelectionContainer>
  );
};