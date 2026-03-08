// TODO: Find a better how of handle this
export const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  "🥬 Fruits & Vegetables": { bg: "bg-green-100", text: "text-green-700" },
  "🥬 Frutas y Verduras": { bg: "bg-green-100", text: "text-green-700" },
  "🥩 Meat & Seafood": { bg: "bg-red-100", text: "text-red-700" },
  "🥩 Carnes y Mariscos": { bg: "bg-red-100", text: "text-red-700" },
  "🧀 Dairy & Eggs": { bg: "bg-blue-100", text: "text-blue-700" },
  "🧀 Lácteos y Huevos": { bg: "bg-blue-100", text: "text-blue-700" },
  "🍞 Bakery": { bg: "bg-amber-100", text: "text-amber-700" },
  "🍞 Panadería": { bg: "bg-amber-100", text: "text-amber-700" },
  "🧊 Frozen Foods": { bg: "bg-cyan-100", text: "text-cyan-700" },
  "🧊 Congelados": { bg: "bg-cyan-100", text: "text-cyan-700" },
  "🥫 Pantry": { bg: "bg-yellow-100", text: "text-yellow-700" },
  "🥫 Despensa": { bg: "bg-yellow-100", text: "text-yellow-700" },
  "🥤 Beverages": { bg: "bg-purple-100", text: "text-purple-700" },
  "🥤 Bebidas": { bg: "bg-purple-100", text: "text-purple-700" },
  "🍪 Snacks": { bg: "bg-orange-100", text: "text-orange-700" },
  "🍪 Botanas": { bg: "bg-orange-100", text: "text-orange-700" },
  "🧂 Condiments & Sauces": { bg: "bg-red-100", text: "text-red-700" },
  "🧂 Condimentos y Salsas": { bg: "bg-red-100", text: "text-red-700" },
  "🥫 Canned Goods": { bg: "bg-gray-100", text: "text-gray-700" },
  "🥫 Enlatados": { bg: "bg-gray-100", text: "text-gray-700" },
  "🧻 Household": { bg: "bg-sky-100", text: "text-sky-700" },
  "🧻 Hogar": { bg: "bg-sky-100", text: "text-sky-700" },
  "🧴 Personal Care": { bg: "bg-pink-100", text: "text-pink-700" },
  "🧴 Cuidado Personal": { bg: "bg-pink-100", text: "text-pink-700" },
  "📦 Other": { bg: "bg-gray-100", text: "text-gray-700" },
  "📦 Otros": { bg: "bg-gray-100", text: "text-gray-700" },
};

export function getCategoryColor(category: string) {
  return (
    CATEGORY_COLORS[category] || { bg: "bg-gray-100", text: "text-gray-700" }
  );
}
