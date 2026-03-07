import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ItemRow } from '../../src/components/ItemRow';
import { Item } from '../../src/types';

describe('ItemRow', () => {
  const mockItem: Item = {
    id: '1',
    listId: 'list-1',
    name: 'Milk',
    quantity: '2',
    price: '15.50',
    checked: false,
    category: 'Dairy',
  };

  const defaultProps = {
    onToggle: () => {},
    onEdit: () => {},
    onDelete: () => {},
  };

  it('should render item name', () => {
    render(<ItemRow item={mockItem} {...defaultProps} />);
    expect(screen.getByText('Milk')).toBeInTheDocument();
  });

  it('should render quantity and price', () => {
    render(<ItemRow item={mockItem} {...defaultProps} />);
    expect(screen.getByText('2 x $15.50')).toBeInTheDocument();
  });

  it('should render category badge', () => {
    render(<ItemRow item={mockItem} {...defaultProps} />);
    expect(screen.getByText('Dairy')).toBeInTheDocument();
  });

  it('should show line-through when checked', () => {
    const checkedItem = { ...mockItem, checked: true };
    render(<ItemRow item={checkedItem} {...defaultProps} />);
    
    const nameElement = screen.getByText('Milk');
    expect(nameElement).toHaveClass('line-through');
  });

  it('should calculate subtotal when checked', () => {
    const checkedItem = { ...mockItem, checked: true };
    render(<ItemRow item={checkedItem} {...defaultProps} />);
    
    expect(screen.getByText('= $31.00')).toBeInTheDocument();
  });

  it('should call onToggle when checkbox is clicked', () => {
    const handleToggle = vi.fn();
    render(<ItemRow item={mockItem} {...defaultProps} onToggle={handleToggle} />);
    
    const checkbox = screen.getByRole('checkbox');
    checkbox.click();
    
    expect(handleToggle).toHaveBeenCalledWith('1');
  });

  it('should call onToggle when row is clicked', () => {
    const handleToggle = vi.fn();
    render(<ItemRow item={mockItem} {...defaultProps} onToggle={handleToggle} />);
    
    screen.getByText('Milk').click();
    expect(handleToggle).toHaveBeenCalledWith('1');
  });

  it('should call onEdit when edit button is clicked', () => {
    const handleEdit = vi.fn();
    render(<ItemRow item={mockItem} {...defaultProps} onEdit={handleEdit} />);
    
    const buttons = screen.getAllByRole('button');
    const editButton = buttons.find(b => b.querySelector('path[d*="15.232"]'));
    editButton?.click();
    
    expect(handleEdit).toHaveBeenCalledWith(mockItem);
  });

  it('should call onDelete when delete button is clicked', () => {
    const handleDelete = vi.fn();
    render(<ItemRow item={mockItem} {...defaultProps} onDelete={handleDelete} />);
    
    const buttons = screen.getAllByRole('button');
    const deleteButton = buttons.find(b => b.querySelector('path[d*="19 7"]'));
    deleteButton?.click();
    
    expect(handleDelete).toHaveBeenCalledWith('1');
  });
});
