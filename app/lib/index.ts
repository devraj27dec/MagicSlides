export const getCategoryColor = (category: string) => {
  switch (category.toLowerCase()) {
    case "important":
      return "bg-red-100 text-red-700 border-red-300";
    case "promotions":
      return "bg-yellow-100 text-yellow-700 border-yellow-300";
    case "social":
      return "bg-blue-100 text-blue-700 border-blue-300";
    case "marketing":
      return "bg-purple-100 text-purple-700 border-purple-300";
    case "spam":
      return "bg-gray-100 text-gray-700 border-gray-300";
    case "general":
      return "bg-green-100 text-green-700 border-green-300";
    default:
      return "bg-gray-50 text-gray-600 border-gray-200";
  }
};
