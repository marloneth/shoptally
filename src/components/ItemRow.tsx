import { useState, useRef } from 'react';
import { Item } from '../types';

interface ItemRowProps {
  item: Item;
  onToggle: (id: string) => void;
  onEdit: (item: Item) => void;
  onDelete: (id: string) => void;
}

export function ItemRow({ item, onToggle, onEdit, onDelete }: ItemRowProps) {
  const [swipeX, setSwipeX] = useState(0);
  const [isSwipeActive, setIsSwipeActive] = useState(false);
  const touchStartX = useRef(0);

  const subtotal = item.checked && item.quantity && item.price
    ? parseFloat(item.quantity) * parseFloat(item.price)
    : 0;

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setIsSwipeActive(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const currentX = e.touches[0].clientX;
    const diff = touchStartX.current - currentX;
    if (diff > 0) {
      setSwipeX(Math.min(diff, 100));
    }
  };

  const handleTouchEnd = () => {
    if (swipeX > 60) {
      setSwipeX(100);
    } else {
      setSwipeX(0);
    }
    setIsSwipeActive(false);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(item.id);
  };

  const handleRowClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest('button')) return;
    onToggle(item.id);
  };

  return (
    <div className="relative overflow-hidden">
      <div 
        className="absolute right-0 top-0 bottom-0 w-24 bg-red-600 flex items-center justify-center"
        style={{ transform: `translateX(${100 - swipeX}%)` }}
      >
        <button onClick={handleDelete} className="p-3 text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
      <div 
        onClick={handleRowClick}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={`flex items-center gap-3 p-3 bg-white border-b border-gray-100 cursor-pointer transition-transform ${item.checked ? 'bg-gray-50' : ''}`}
        style={{ transform: `translateX(-${swipeX}%)`, transition: isSwipeActive ? 'none' : 'transform 0.2s ease-out' }}
      >
        <input
          type="checkbox"
          checked={item.checked}
          onChange={(e) => { e.stopPropagation(); onToggle(item.id); }}
          className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
        />
        <div className="flex-1 min-w-0">
          <p className={`text-gray-900 truncate ${item.checked ? 'line-through text-gray-400' : ''}`}>
            {item.name}
          </p>
          {(item.quantity || item.price) && (
            <p className="text-sm text-gray-500">
              {item.quantity && item.quantity}
              {item.quantity && item.price && ' x '}
              {item.price && '$' + item.price}
              {item.checked && subtotal > 0 && <span className="ml-2 font-medium">= ${subtotal.toFixed(2)}</span>}
            </p>
          )}
        </div>
        {item.category && (
          <span className="px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full">
            {item.category}
          </span>
        )}
        <button
          onClick={(e) => { e.stopPropagation(); onEdit(item); }}
          className="p-2 text-gray-400 hover:text-blue-600"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
