import { useTranslation } from 'react-i18next';
import { List } from '../types';

interface ListCardProps {
  list: List;
  itemCount: number;
  onClick: () => void;
}

export function ListCard({ list, itemCount, onClick }: ListCardProps) {
  const { t } = useTranslation();
  const date = new Date(list.createdAt).toLocaleDateString('es-MX', {
    day: 'numeric',
    month: 'short',
  });

  return (
    <button
      onClick={onClick}
      className="w-full p-5 text-left bg-white border border-gray-200 rounded-xl shadow-sm hover:border-blue-500 hover:shadow-md transition-all active:scale-[0.99]"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 truncate">{list.name}</h3>
        <span className="text-sm text-gray-500">{date}</span>
      </div>
      <p className="mt-2 text-base text-gray-500">
        {t('listCard.item', { count: itemCount })}
      </p>
    </button>
  );
}
