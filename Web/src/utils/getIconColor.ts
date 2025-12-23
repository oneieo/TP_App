export const getCategoryIcon = (category: string): string => {
  const icons = {
    CAFE: "ri-cup-fill",
    RESTAURANT: "ri-restaurant-fill",
    BAR: "ri-beer-fill",
    ETC: "ri-shopping-bag-fill",
    partner: "ri-service-fill",
    health: "ri-heart-pulse-fill",
    beauty: "ri-scissors-cut-fill",
    default: "ri-store-fill",
  };
  return icons[category as keyof typeof icons] || icons.default;
};

export const getCategoryColor = (category: string): string => {
  const categoryColors: Record<string, string> = {
    RESTAURANT: "bg-amber-100",
    CAFE: "bg-pink-100",
    BAR: "bg-green-100",
    ETC: "bg-blue-100",
  };
  return categoryColors[category] || "bg-gray-100";
};

export const getCategoryTextColor = (category: string): string => {
  const categoryTextColors: Record<string, string> = {
    RESTAURANT: "text-amber-500",
    CAFE: "text-pink-500",
    BAR: "text-green-500",
    ETC: "text-blue-500",
  };
  return categoryTextColors[category] || "text-text-secondary";
};
