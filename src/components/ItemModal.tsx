import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Item } from '../types';

interface ItemModalProps {
  isOpen: boolean;
  item: Item | null;
  onSave: (item: Item) => void;
  onClose: () => void;
}

export function ItemModal({ isOpen, item, onSave, onClose }: ItemModalProps) {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const priceInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (item && isOpen) {
      setName(item.name);
      setQuantity(item.quantity || '1');
      setPrice(item.price || '0');
      setCategory(item.category);
      setTimeout(() => priceInputRef.current?.focus(), 0);
    } else {
      setName('');
      setQuantity('');
      setPrice('');
      setCategory('');
    }
  }, [item, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!item || !name.trim()) return;
    
    onSave({
      ...item,
      name: name.trim(),
      quantity: quantity.trim(),
      price: price.trim(),
      category: category.trim(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-4">
      <div className="w-full bg-white rounded-t-2xl sm:rounded-2xl sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900">{t('itemModal.editItem')}</h3>
          </div>
          <div className="p-6 space-y-5">
            <div>
              <label className="block text-base font-medium text-gray-700">{t('itemModal.name')}</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-2 block w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
                autoFocus
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-base font-medium text-gray-700">{t('itemModal.quantity')}</label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="mt-2 block w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
                  placeholder="1"
                  min="0"
                  step="any"
                />
              </div>
              <div>
                <label className="block text-base font-medium text-gray-700">{t('itemModal.price')}</label>
                <input
                  ref={priceInputRef}
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="mt-2 block w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>
            <div>
              <label className="block text-base font-medium text-gray-700">{t('itemModal.category')}</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-2 block w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500"
                placeholder={t('itemModal.category')}
              />
            </div>
          </div>
          <div className="flex gap-3 p-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-5 py-3 text-base font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 active:scale-[0.98] transition-all"
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              className="flex-1 px-5 py-3 text-base font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 active:scale-[0.98] transition-all"
            >
              {t('common.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
