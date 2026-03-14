import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { List, Item } from "../types";
import {
  getLists,
  getItems,
  saveLists,
  saveItems,
  generateId,
} from "../utils/storage";
import { ItemRow } from "../components/ItemRow";
import { ItemModal } from "../components/ItemModal";
import { ConfirmModal } from "../components/ConfirmModal";
import { EmptyState } from "../components/EmptyState";
import { BackIcon, TrashIcon, PlusIcon } from "../components/icons";
import { getCategoryColor } from "../utils/categoryColors";

export function ListDetail() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const PREDEFINED_CATEGORIES = [
    "fruits",
    "meat",
    "dairy",
    "bakery",
    "frozen",
    "pantry",
    "beverages",
    "snacks",
    "condiments",
    "canned",
    "household",
    "personal",
    "other",
  ].map((key) => t(`categories.${key}`));
  const [list, setList] = useState<List | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [newItemName, setNewItemName] = useState("");
  const [newItemCategory, setNewItemCategory] = useState("");
  const [newItemCustomCategory, setNewItemCustomCategory] = useState("");
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState(false);
  const [completeConfirm, setCompleteConfirm] = useState(false);
  const [editedName, setEditedName] = useState("");

  useEffect(() => {
    if (!id) return;
    const lists = getLists();
    const foundList = lists.find((l) => l.id === id);
    if (foundList) {
      setList(foundList);
      setEditedName(foundList.name);
      setItems(getItems(id));
    }
  }, [id]);

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim() || !id || !list) return;

    const category = newItemCustomCategory.trim() || newItemCategory;

    const newItem: Item = {
      id: generateId(),
      listId: id,
      name: newItemName.trim(),
      quantity: "",
      price: "",
      checked: false,
      category: category,
    };

    const updatedItems = [newItem, ...items];
    setItems(updatedItems);
    saveItems(id, updatedItems);
    setNewItemName("");
    setNewItemCategory("");
    setNewItemCustomCategory("");
  };

  const handleToggleItem = (itemId: string) => {
    if (!id) return;

    const itemToToggle = items.find((item) => item.id === itemId);
    if (!itemToToggle) return;

    const willCheck = !itemToToggle.checked;

    if (willCheck && !itemToToggle.price) {
      setEditingItem({
        ...itemToToggle,
        checked: true,
        quantity: itemToToggle.quantity || "1",
        price: itemToToggle.price || "0",
      });
      return;
    }

    const updatedItems = items.map((item) =>
      item.id === itemId ? { ...item, checked: !item.checked } : item,
    );
    setItems(updatedItems);
    saveItems(id, updatedItems);
  };

  const handleEditItem = (item: Item) => {
    setEditingItem(item);
  };

  const handleSaveItem = (updatedItem: Item) => {
    if (!id) return;
    const updatedItems = items.map((item) =>
      item.id === updatedItem.id ? updatedItem : item,
    );
    setItems(updatedItems);
    saveItems(id, updatedItems);
    setEditingItem(null);
  };

  const handleDeleteItem = (itemId: string) => {
    if (!id) return;
    const updatedItems = items.filter((item) => item.id !== itemId);
    setItems(updatedItems);
    saveItems(id, updatedItems);
  };

  const handleCompleteList = () => {
    if (!list || !id) return;
    const lists = getLists();
    const updatedLists = lists.map((l) =>
      l.id === id
        ? {
            ...l,
            status: "completed" as const,
            completedAt: new Date().toISOString(),
          }
        : l,
    );
    saveLists(updatedLists);
    navigate("/");
  };

  const handleDeleteList = () => {
    if (!id) return;
    const lists = getLists();
    const updatedLists = lists.filter((l) => l.id !== id);
    saveLists(updatedLists);
    localStorage.removeItem(`shoptally_items_${id}`);
    navigate("/");
  };

  const handleUpdateName = () => {
    if (!list || !id || !editedName.trim()) return;
    const lists = getLists();
    const updatedLists = lists.map((l) =>
      l.id === id ? { ...l, name: editedName.trim() } : l,
    );
    saveLists(updatedLists);
    setList({ ...list, name: editedName.trim() });
  };

  const calculateTotal = () => {
    return items
      .filter((item) => item.checked && item.quantity && item.price)
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

  const isActive = list.status === "active";
  const total = calculateTotal();

  const groupedItems = items.reduce<Record<string, Item[]>>((acc, item) => {
    const category = item.category || t("listDetail.uncategorized");
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {});

  const sortedCategories = Object.keys(groupedItems).sort((a, b) => {
    if (a === t("listDetail.uncategorized")) return 1;
    if (b === t("listDetail.uncategorized")) return -1;
    return a.localeCompare(b);
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-48">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4">
          <div className="flex items-center gap-3 py-4">
            <button
              onClick={() => navigate("/")}
              className="p-1 -ml-1 text-gray-600 hover:text-gray-900"
            >
              <BackIcon className="w-6 h-6" />
            </button>
            <h1 className="flex-1 text-lg font-semibold text-gray-900">
              {list.name}
            </h1>
            {isActive && (
              <button
                onClick={() => setDeleteConfirm(true)}
                className="p-2 text-gray-400 hover:text-red-600"
              >
                <TrashIcon className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 py-4">
        {items.length === 0 ? (
          <EmptyState
            title={t("listDetail.noItems")}
            message={t("listDetail.noItemsMessage")}
          />
        ) : (
          <div className="space-y-5">
            {sortedCategories.map((category) => (
              <div
                key={category}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
              >
                <div
                  className={`px-4 py-2 border-b border-gray-200 ${getCategoryColor(category).bg}`}
                >
                  <h2
                    className={`text-sm font-semibold ${getCategoryColor(category).text}`}
                  >
                    {category}
                  </h2>
                </div>
                {groupedItems[category].map((item) => (
                  <ItemRow
                    key={item.id}
                    item={item}
                    isActive={isActive}
                    onToggle={handleToggleItem}
                    onEdit={handleEditItem}
                    onDelete={(itemId) => isActive && handleDeleteItem(itemId)}
                  />
                ))}
              </div>
            ))}
          </div>
        )}
      </main>

      {isActive && (
        <>
          <form
            onSubmit={handleAddItem}
            className="fixed bottom-20 inset-x-0 bg-white border-t border-gray-200 shadow-lg"
          >
            <div className="max-w-md mx-auto px-3 py-3 space-y-2">
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder={t("listDetail.addItem")}
                  className="flex-1 min-w-0 px-3 py-2 text-base border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  disabled={!newItemName.trim()}
                  className="shrink-0 px-4 py-3 text-base font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <PlusIcon className="w-5 h-5" />
                </button>
              </div>
              <div className="flex gap-2 items-center">
                <select
                  value={newItemCategory}
                  onChange={(e) => {
                    setNewItemCategory(e.target.value);
                    setNewItemCustomCategory("");
                  }}
                  className="flex-1 min-w-0 px-2 py-2 text-sm border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 bg-white truncate"
                >
                  <option value="">{t("listDetail.category")}</option>
                  {PREDEFINED_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={newItemCustomCategory}
                  onChange={(e) => setNewItemCustomCategory(e.target.value)}
                  placeholder={t("listDetail.customCategory")}
                  className="flex-1 min-w-0 px-2 py-2 text-sm border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </form>

          <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-200 shadow-lg">
            <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{t("listDetail.total")}</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${total.toFixed(2)}
                </p>
              </div>
              <button
                onClick={() => setCompleteConfirm(true)}
                disabled={items.length === 0}
                className="px-6 py-2 text-base font-medium bg-green-600 text-white rounded-lg hover:bg-green-700 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {t("listDetail.complete")}
              </button>
            </div>
          </div>
        </>
      )}

      {!isActive && (
        <div className="fixed bottom-6 left-0 right-0">
          <div className="max-w-md mx-auto px-4">
            <div className="bg-white border-t border-gray-200 shadow-lg p-4">
              <p className="text-sm text-gray-500">{t("listDetail.total")}</p>
              <p className="text-2xl font-bold text-gray-900">
                ${total.toFixed(2)}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                {t("listDetail.completed")}{" "}
                {new Date(list.completedAt!).toLocaleDateString("es-MX")}
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
        title={t("listDetail.deleteList")}
        message={t("listDetail.deleteMessage")}
        onConfirm={handleDeleteList}
        onCancel={() => setDeleteConfirm(false)}
      />

      <ConfirmModal
        isOpen={completeConfirm}
        title={t("listDetail.completeList")}
        message={t("listDetail.completeMessage")}
        onConfirm={handleCompleteList}
        onCancel={() => setCompleteConfirm(false)}
        confirmLabel={t("listDetail.complete")}
        confirmVariant="primary"
      />
    </div>
  );
}
