import { List } from '../types';

interface ListCardProps {
  list: List;
  itemCount: number;
  onClick: () => void;
}

export function ListCard({ list, itemCount, onClick }: ListCardProps) {
  const date = new Date(list.createdAt).toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'short',
  });

  return (
    <button
      onClick={onClick}
      className="w-full p-4 text-left bg-white border border-gray-200 rounded-lg shadow-sm hover:border-blue-500 hover:shadow-md transition-all"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-gray-900 truncate">{list.name}</h3>
        <span className="text-sm text-gray-500">{date}</span>
      </div>
      <p className="mt-1 text-sm text-gray-500">
        {itemCount} {itemCount === 1 ? 'item' : 'items'}
      </p>
    </button>
  );
}
