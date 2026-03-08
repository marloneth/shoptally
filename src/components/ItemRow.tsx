import { useState, useRef } from "react";
import { Item } from "../types";
import { TrashIcon, EditIcon } from "./icons";

interface ItemRowProps {
  item: Item;
  isActive?: boolean;
  onToggle: (id: string) => void;
  onEdit: (item: Item) => void;
  onDelete: (id: string) => void;
}

export function ItemRow({ item, isActive = true, onToggle, onEdit, onDelete }: ItemRowProps) {
  const [swipeX, setSwipeX] = useState(0);
  const [isSwipeActive, setIsSwipeActive] = useState(false);
  const touchStartX = useRef(0);

  const subtotal =
    item.checked && item.quantity && item.price
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
    if (!isActive) return;
    const target = e.target as HTMLElement;
    if (target.closest("button")) return;
    onToggle(item.id);
  };

  return (
    <div className="relative overflow-hidden">
      <div
        className="absolute right-0 top-0 bottom-0 w-24 bg-red-600 flex items-center justify-center"
        style={{ transform: `translateX(${100 - swipeX}%)` }}
      >
        <button onClick={handleDelete} className="p-4 text-white">
          <TrashIcon className="w-6 h-6" />
        </button>
      </div>
      <div
        onClick={handleRowClick}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={`flex items-center gap-4 p-4 bg-white border-b border-gray-100 cursor-pointer transition-transform ${item.checked ? "bg-gray-50" : ""}`}
        style={{
          transform: `translateX(-${swipeX}%)`,
          transition: isSwipeActive ? "none" : "transform 0.2s ease-out",
        }}
      >
        <input
          type="checkbox"
          checked={item.checked}
          onChange={(e) => {
            e.stopPropagation();
            if (isActive) onToggle(item.id);
          }}
          disabled={!isActive}
          className="w-6 h-6 text-blue-600 rounded border-gray-300 focus:ring-blue-500 disabled:opacity-50"
        />
        <div className="flex-1 min-w-0">
          <p
            className={`text-lg text-gray-900 truncate ${item.checked ? "line-through text-gray-400" : ""}`}
          >
            {item.name}
          </p>
          {(item.quantity || item.price) && (
            <p className="mt-1 text-base text-gray-500">
              {item.quantity && item.quantity}
              {item.quantity && item.price && " x "}
              {item.price && "$" + item.price}
              {item.checked && subtotal > 0 && (
                <span className="ml-2 font-medium">
                  = ${subtotal.toFixed(2)}
                </span>
              )}
            </p>
          )}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (isActive) onEdit(item);
          }}
          className={`p-3 ${isActive ? 'text-gray-400 hover:text-blue-600' : 'text-gray-200'}`}
        >
          <EditIcon className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
