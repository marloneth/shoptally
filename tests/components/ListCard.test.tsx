import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ListCard } from '../../src/components/ListCard';
import { List } from '../../src/types';

describe('ListCard', () => {
  const mockList: List = {
    id: '1',
    name: 'Weekly groceries',
    createdAt: '2024-01-15T10:00:00.000Z',
    status: 'active',
  };

  it('should render list name', () => {
    render(<ListCard list={mockList} itemCount={5} onClick={() => {}} />);
    expect(screen.getByText('Weekly groceries')).toBeInTheDocument();
  });

  it('should render item count', () => {
    render(<ListCard list={mockList} itemCount={5} onClick={() => {}} />);
    expect(screen.getByText('5 items')).toBeInTheDocument();
  });

  it('should render singular item text for count of 1', () => {
    render(<ListCard list={mockList} itemCount={1} onClick={() => {}} />);
    expect(screen.getByText('1 item')).toBeInTheDocument();
  });

  it('should call onClick when clicked', () => {
    const handleClick = vi.fn();
    render(<ListCard list={mockList} itemCount={5} onClick={handleClick} />);
    
    screen.getByText('Weekly groceries').closest('button')?.click();
    expect(handleClick).toHaveBeenCalled();
  });
});
