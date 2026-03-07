import { List, Item } from '../types';

const LISTS_KEY = 'shoptally_lists';

export const getLists = (): List[] => {
  const data = localStorage.getItem(LISTS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveLists = (lists: List[]): void => {
  localStorage.setItem(LISTS_KEY, JSON.stringify(lists));
};

export const getItemsKey = (listId: string) => `shoptally_items_${listId}`;

export const getItems = (listId: string): Item[] => {
  const data = localStorage.getItem(getItemsKey(listId));
  return data ? JSON.parse(data) : [];
};

export const saveItems = (listId: string, items: Item[]): void => {
  localStorage.setItem(getItemsKey(listId), JSON.stringify(items));
};

export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};
