import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { List, Item } from '../types';
import { getLists, getItems, saveLists, saveItems, generateId } from '../utils/storage';
import { ItemRow } from '../components/ItemRow';
import { ItemModal } from '../components/ItemModal';
import { ConfirmModal } from '../components/ConfirmModal';
import { EmptyState } from '../components/EmptyState';

export function ListDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [list, setList] = useState<List | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [newItemName, setNewItemName] = useState('');
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [editedName, setEditedName] = useState('');

  useEffect(() => {
    if (!id) return;
    const lists = getLists();
    const foundList = lists.find(l => l.id === id);
    if (foundList) {
      setList(foundList);
      setEditedName(foundList.name);
      setItems(getItems(id));
    }
  }, [id]);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim() || !id || !list) return;

    const newItem: Item = {
      id: generateId(),
      listId: id,
      name: newItemName.trim(),
      quantity: '',
      price: '',
      checked: false,
      category: '',
    };

    const updatedItems = [newItem, ...items];
    setItems(updatedItems);
    saveItems(id, updatedItems);
    setNewItemName('');
  };

  const handleToggleItem = (itemId: string) => {
    if (!id) return;
    
    const itemToToggle = items.find(item => item.id === itemId);
    if (!itemToToggle) return;
    
    const willCheck = !itemToToggle.checked;
    
    if (willCheck && (!itemToToggle.quantity || !itemToToggle.price)) {
      setEditingItem({ ...itemToToggle, checked: true });
      return;
    }
    
    const updatedItems = items.map(item =>
      item.id === itemId ? { ...item, checked: !item.checked } : item
    );
    setItems(updatedItems);
    saveItems(id, updatedItems);
  };

  const handleEditItem = (item: Item) => {
    setEditingItem(item);
  };

  const handleSaveItem = (updatedItem: Item) => {
    if (!id) return;
    const updatedItems = items.map(item =>
      item.id === updatedItem.id ? updatedItem : item
    );
    setItems(updatedItems);
    saveItems(id, updatedItems);
    setEditingItem(null);
  };

  const handleDeleteItem = (itemId: string) => {
    if (!id) return;
    const updatedItems = items.filter(item => item.id !== itemId);
    setItems(updatedItems);
    saveItems(id, updatedItems);
  };

  const handleCompleteList = () => {
    if (!list || !id) return;
    const lists = getLists();
    const updatedLists = lists.map(l =>
      l.id === id ? { ...l, status: 'completed' as const, completedAt: new Date().toISOString() } : l
    );
    saveLists(updatedLists);
    navigate('/');
  };

  const handleDeleteList = () => {
    if (!id) return;
    const lists = getLists();
    const updatedLists = lists.filter(l => l.id !== id);
    saveLists(updatedLists);
    localStorage.removeItem(`shoptally_items_${id}`);
    navigate('/');
  };

  const handleUpdateName = () => {
    if (!list || !id || !editedName.trim()) return;
    const lists = getLists();
    const updatedLists = lists.map(l =>
      l.id === id ? { ...l, name: editedName.trim() } : l
    );
    saveLists(updatedLists);
    setList({ ...list, name: editedName.trim() });
  };

  const calculateTotal = () => {
    return items
      .filter(item => item.checked && item.quantity && item.price)
      .reduce((sum, item) => {
        return sum + parseFloat(item.quantity) * parseFloat(item.price);
      }, 0);
  };

  if (!list) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  const isActive = list.status === 'active';
  const total = calculateTotal();

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4">
          <div className="flex items-center gap-3 py-4">
            <button onClick={() => navigate('/')} className="p-1 -ml-1 text-gray-600 hover:text-gray-900">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="flex-1 text-lg font-semibold text-gray-900">
              {list.name}
            </h1>
            {isActive && (
              <button
                onClick={() => setDeleteConfirm(true)}
                className="p-2 text-gray-400 hover:text-red-600"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-4">
        {items.length === 0 ? (
          <EmptyState title="No items yet" message="Add items to your shopping list" />
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {items.map(item => (
              <ItemRow
                key={item.id}
                item={item}
                onToggle={handleToggleItem}
                onEdit={handleEditItem}
                onDelete={(itemId) => isActive && handleDeleteItem(itemId)}
              />
            ))}
          </div>
        )}
      </main>

      {isActive && (
        <>
          <form onSubmit={handleAddItem} className="fixed bottom-20 left-0 right-0 bg-white border-t border-gray-200">
            <div className="max-w-md mx-auto px-4 py-3 flex gap-2">
              <input
                type="text"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder="Add item..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                disabled={!newItemName.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Add
              </button>
            </div>
          </form>

          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
            <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total (checked items)</p>
                <p className="text-2xl font-bold text-gray-900">${total.toFixed(2)}</p>
              </div>
              <button
                onClick={handleCompleteList}
                disabled={items.length === 0}
                className="px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Complete
              </button>
            </div>
          </div>
        </>
      )}

      {!isActive && (
        <div className="fixed bottom-6 left-0 right-0">
          <div className="max-w-md mx-auto px-4">
            <div className="bg-white border-t border-gray-200 shadow-lg p-4">
              <p className="text-sm text-gray-500">Total</p>
              <p className="text-2xl font-bold text-gray-900">${total.toFixed(2)}</p>
              <p className="text-sm text-gray-500 mt-2">
                Completed on {new Date(list.completedAt!).toLocaleDateString('es-MX')}
              </p>
            </div>
          </div>
        </div>
      )}

      <ItemModal
        isOpen={!!editingItem}
        item={editingItem}
        onSave={handleSaveItem}
        onClose={() => setEditingItem(null)}
      />

      <ConfirmModal
        isOpen={deleteConfirm}
        title="Delete List"
        message={`Are you sure you want to delete "${list.name}"? This action cannot be undone.`}
        onConfirm={handleDeleteList}
        onCancel={() => setDeleteConfirm(false)}
      />
    </div>
  );
}
