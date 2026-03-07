export interface List {
  id: string;
  name: string;
  createdAt: string;
  completedAt?: string;
  status: 'active' | 'completed';
}

export interface Item {
  id: string;
  listId: string;
  name: string;
  quantity: string;
  price: string;
  checked: boolean;
  category: string;
}
