import { TCategory } from '@/models/category.model';
import { CategoryService } from '@/services/category/category.service';
import { fakeDelay } from '@/utils/fakeDelay.utl';
import { create } from 'zustand';

interface CategoryData {
  isFetchedCategory: boolean;
  categories: TCategory[];
  fetchCategories: () => Promise<TCategory[]>,
  clear: () => void,
  // setCategory: (categories: TCategory[]) => void;
}

export const useCategoryStore = create<CategoryData>((set, get, k) => ({
  categories: [],
  isFetchedCategory: false,
  fetchCategories: async (pageSize?: number, pageIndex?: number) => {
    const {isFetchedCategory, categories} = get();
    if (!isFetchedCategory) {
      return await CategoryService.filterCategories({pageSize: pageSize ?? 48}).then(({data: categories})=>{
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
  clear: () => {
    set({categories: [], isFetchedCategory: false});
  },
  // setCategory(categories) {
  //   set({ categories });
  // },
}));
