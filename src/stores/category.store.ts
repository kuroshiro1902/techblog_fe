import { TCategory } from '@/models/category.model';
import { CategoryService } from '@/services/category/category.service';
import { fakeDelay } from '@/utils/fakeDelay.utl';
import { create } from 'zustand';

interface CategoryData {
  isFetchedCategory: boolean;
  categories: TCategory[];
  fetchCategories: () => Promise<TCategory[]>,
  // setCategory: (categories: TCategory[]) => void;
}

export const useCategoryStore = create<CategoryData>((set, get, k) => ({
  categories: [],
  isFetchedCategory: false,
  fetchCategories: async () => {
    const {isFetchedCategory, categories} = get();
    if (!isFetchedCategory) {
      return await CategoryService.filterCategories({}).then(({data: categories})=>{
        set({ categories, isFetchedCategory: true });
        return categories;
      }).catch((err)=>{
        alert(err.message);
        set({ categories: [], isFetchedCategory: false });
        return [] as TCategory[];
      });
    }
    return categories;
  },
  // setCategory(categories) {
  //   set({ categories });
  // },
}));
