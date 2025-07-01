// Category types for category management and display

export interface CategoryData {
  _id?: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  image?: string;
  isActive: boolean;
  parentId?: string | null | CategoryData;
  children?: CategoryData[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryFilter {
  parent?: string | null;
  active?: boolean;
  search?: string;
  sortBy?: 'name' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
}

export interface CategoriesResponse {
  categories: CategoryData[];
  count: number;
}

export interface CategoryFormData {
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  image?: string;
  isActive?: boolean;
  parentId?: string | null;
}

// Helper function to convert categories to a hierarchical structure
export const buildCategoryTree = (categories: CategoryData[]): CategoryData[] => {
  const categoryMap = new Map<string, CategoryData>();
  const rootCategories: CategoryData[] = [];

  // First pass: create a map of all categories
  categories.forEach(category => {
    const categoryCopy = { ...category, children: [] };
    categoryMap.set(category._id || '', categoryCopy);
  });

  // Second pass: build the tree structure
  categories.forEach(category => {
    const categoryId = category._id || '';
    const parentId = typeof category.parentId === 'string' ? category.parentId : 
                    category.parentId && typeof category.parentId === 'object' ? category.parentId._id : null;

    if (parentId && categoryMap.has(parentId)) {
      // Add as child to parent
      const parent = categoryMap.get(parentId);
      if (parent && parent.children) {
        parent.children.push(categoryMap.get(categoryId) as CategoryData);
      }
    } else {
      // Add to root categories
      rootCategories.push(categoryMap.get(categoryId) as CategoryData);
    }
  });

  return rootCategories;
};
