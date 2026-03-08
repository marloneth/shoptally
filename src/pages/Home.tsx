import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { List } from '../types';
import { getLists, getItems, saveLists, generateId } from '../utils/storage';
import { ListCard } from '../components/ListCard';
import { EmptyState } from '../components/EmptyState';
import { ConfirmModal } from '../components/ConfirmModal';
import { LanguageSwitcher } from '../components/LanguageSwitcher';
import { TrashIcon, PlusIcon } from '../components/icons';

export function Home() {
  const { t } = useTranslation();
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
          <div className="flex items-center justify-between py-4">
            <h1 className="text-xl font-bold text-gray-900">{t('app.name')}</h1>
            <LanguageSwitcher />
          </div>
          <div className="flex gap-1 -mb-px">
            <button
              onClick={() => setActiveTab('active')}
              className={`flex-1 py-4 text-base font-medium border-b-2 transition-colors ${
                activeTab === 'active'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {t('home.active')} ({activeLists.length})
            </button>
            <button
              onClick={() => setActiveTab('completed')}
              className={`flex-1 py-4 text-base font-medium border-b-2 transition-colors ${
                activeTab === 'completed'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {t('home.completed')} ({completedLists.length})
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-4 pb-24">
        {displayedLists.length === 0 ? (
          <EmptyState
            title={activeTab === 'active' ? t('home.noLists') : t('home.noLists')}
            message={activeTab === 'active' ? t('home.noListsMessage') : t('home.noListsMessage')}
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
                    <TrashIcon className="w-5 h-5" />
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
          className="fixed bottom-6 right-6 w-16 h-16 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 active:scale-95 flex items-center justify-center transition-all"
        >
          <PlusIcon className="w-7 h-7" />
        </button>
      )}

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm p-6 bg-white rounded-2xl shadow-xl">
            <h3 className="text-xl font-semibold text-gray-900">{t('home.createList')}</h3>
            <form onSubmit={(e) => { e.preventDefault(); handleCreateList(); }} className="mt-6">
              <input
                type="text"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                placeholder={t('home.title')}
                className="w-full px-4 py-3 text-lg border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                autoFocus
              />
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => { setShowCreateModal(false); setNewListName(''); }}
                  className="flex-1 px-5 py-3 text-base font-medium text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 active:scale-[0.98] transition-all"
                >
                  {t('common.cancel')}
                </button>
                <button
                  type="submit"
                  className="flex-1 px-5 py-3 text-base font-medium text-white bg-blue-600 rounded-xl hover:bg-blue-700 active:scale-[0.98] transition-all"
                >
                  {t('common.add')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={deleteConfirm.show}
        title={t('listDetail.deleteConfirm')}
        message={t('listDetail.deleteMessage')}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteConfirm({ show: false, list: null })}
      />
    </div>
  );
}
