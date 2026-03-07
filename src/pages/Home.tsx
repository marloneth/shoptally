import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { List, Item } from '../types';
import { getLists, getItems, saveLists, generateId } from '../utils/storage';
import { ListCard } from '../components/ListCard';
import { EmptyState } from '../components/EmptyState';
import { ConfirmModal } from '../components/ConfirmModal';

export function Home() {
  const navigate = useNavigate();
  const [lists, setLists] = useState<List[]>([]);
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; list: List | null }>({ show: false, list: null });
  const [itemCounts, setItemCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    setLists(getLists());
  }, []);

  useEffect(() => {
    const counts: Record<string, number> = {};
    lists.forEach(list => {
      const items = getItems(list.id);
      counts[list.id] = items.length;
    });
    setItemCounts(counts);
  }, [lists]);

  const handleCreateList = () => {
    if (!newListName.trim()) return;
    
    const newList: List = {
      id: generateId(),
      name: newListName.trim(),
      createdAt: new Date().toISOString(),
      status: 'active',
    };
    
    const updatedLists = [newList, ...lists];
    saveLists(updatedLists);
    setLists(updatedLists);
    setNewListName('');
    setShowCreateModal(false);
    navigate(`/list/${newList.id}`);
  };

  const handleDeleteList = (list: List) => {
    setDeleteConfirm({ show: true, list });
  };

  const confirmDelete = () => {
    if (!deleteConfirm.list) return;
    
    const updatedLists = lists.filter(l => l.id !== deleteConfirm.list!.id);
    saveLists(updatedLists);
    setLists(updatedLists);
    localStorage.removeItem(`shoptally_items_${deleteConfirm.list!.id}`);
    setDeleteConfirm({ show: false, list: null });
  };

  const activeLists = lists.filter(l => l.status === 'active');
  const completedLists = lists.filter(l => l.status === 'completed');
  const displayedLists = activeTab === 'active' ? activeLists : completedLists;

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4">
          <h1 className="text-xl font-bold text-gray-900 py-4">Shoptally</h1>
          <div className="flex gap-1 -mb-px">
            <button
              onClick={() => setActiveTab('active')}
              className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'active'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Active ({activeLists.length})
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`flex-1 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'completed'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              History ({completedLists.length})
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-4 pb-24">
        {displayedLists.length === 0 ? (
          <EmptyState
            title={activeTab === 'active' ? 'No active lists' : 'No history yet'}
            message={activeTab === 'active' ? 'Create your first shopping list' : 'Completed lists will appear here'}
          />
        ) : (
          <div className="space-y-3">
            {displayedLists.map(list => (
              <div key={list.id} className="relative group">
                <ListCard
                  list={list}
                  itemCount={itemCounts[list.id] || 0}
                  onClick={() => navigate(`/list/${list.id}`)}
                />
                {activeTab === 'completed' && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteList(list);
                    }}
                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      {activeTab === 'active' && (
        <button
          onClick={() => setShowCreateModal(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 flex items-center justify-center transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-sm p-6 mx-4 bg-white rounded-lg shadow-xl">
            <h3 className="text-lg font-semibold text-gray-900">New Shopping List</h3>
            <form onSubmit={(e) => { e.preventDefault(); handleCreateList(); }} className="mt-4">
              <input
                type="text"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                placeholder="List name"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
              />
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => { setShowCreateModal(false); setNewListName(''); }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={deleteConfirm.show}
        title="Delete List"
        message={`Are you sure you want to delete "${deleteConfirm.list?.name}"? This action cannot be undone.`}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteConfirm({ show: false, list: null })}
      />
    </div>
  );
}
