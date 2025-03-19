import { Product } from "@prisma/client";
import { create } from "zustand";
import { useLoadingStore } from "./loading";

type FiltersType = {
  category: string[];
  sort: 'asc' | 'desc';
}

type ScrollFilterType = {
  skip: number;
  take: number;
}

type ProductStoreType = {
  products: Product[];
  setProducts: (products: Product[]) => void;
  getProducts: (filter: FiltersType) => Promise<void>;
  getMoreProducts: (data: ScrollFilterType) => Promise<void>;
}

type FilterStoreType = {
  filter: FiltersType;
  setFilter: <K extends keyof FiltersType>(key: K, value: FiltersType[K]) => void;
};

type ScrollStoreType = {
  scrollFilter: ScrollFilterType;
  isLoadingMore: boolean;
  setScrollFilter: <K extends keyof ScrollFilterType>(
    key: K,
    value: ScrollFilterType[K]
  ) => Promise<void>;
  incrementSkip: () => void;
};

type TotalProductsLength = {
  total: number;
  setTotal: (total: number) => void;
}

const useProductsStore = create<ProductStoreType>(
  (set) => ({
    products: [],
    setProducts: (products: Product[]) => {
      set((state) => ({ products }));
    },
    getProducts: async (filter: FiltersType) => {
      useLoadingStore.getState().setLoading(true);

      let apiFilterPath = filter.category.length < 1
                          ? `?sort=${filter.sort}`
                          : `?sort=${filter.sort}&category=${filter.category.join(',')}`;

      const response = await fetch(`/api/products/get/all${apiFilterPath}`);

      if (!response.ok) {
        console.error("Some error occured, could not fetch products");
        useLoadingStore.getState().setLoading(false);
        return;
      }

      const data = await response.json();
      (set(state => ({ products: data.products })));
      useTotalProductsLengthStore.getState().setTotal(data.count);
      useLoadingStore.getState().setLoading(false);
    },
    getMoreProducts: async (data: ScrollFilterType) => {
      const filter = useProductFilterStore.getState().filter;

      let apiFilterPath = filter.category.length < 1
                          ? `sort=${filter.sort}`
                          : `sort=${filter.sort}&category=${filter.category.join(',')}`;

      const response = await fetch(`/api/products/get/all?skip=${data.skip}&${apiFilterPath}`);

      if (!response.ok) {
        console.error("Some error occured, could not fetch products");
        return;
      }

      const responseData = await response.json();
      (set(state => ({ products: [...state.products, ...responseData.products] })));
      useTotalProductsLengthStore.getState().setTotal(responseData.count);
      useProductScrollStore.getState().incrementSkip();
    },
  })
);

const useProductFilterStore = create<FilterStoreType>(
  (set) => ({
    filter: {category: [], sort: 'asc'},
    setFilter: <K extends keyof FiltersType>(key: K, value: FiltersType[K]) => {
      set((state) => {
        useProductsStore.getState().getProducts({ ...state.filter, [key]: value });
        return { filter: {...state.filter, [key]: value} }
      });
    }
  })
);

const useProductScrollStore = create<ScrollStoreType>((set) => ({
  scrollFilter: { skip: 0, take: 48 },
  isLoadingMore: false,
  setScrollFilter: async <K extends keyof ScrollFilterType>(
    key: K,
    value: ScrollFilterType[K]
  ) => {
    if (useProductScrollStore.getState().isLoadingMore) return; // Prevent multiple calls
    set({ isLoadingMore: true });

    await useProductsStore.getState().getMoreProducts({
      ...useProductScrollStore.getState().scrollFilter,
      [key]: value,
    });

    set({ isLoadingMore: false });
  },
  incrementSkip: () => {
    set(state => ({
      scrollFilter: {...state.scrollFilter, skip: state.scrollFilter.skip + state.scrollFilter.take },
      isLoadingMore: false }));
  },
}));

const useTotalProductsLengthStore = create<TotalProductsLength>(set => ({
  total: 0,
  setTotal: (total: number) => (set(state => ({ total })))
}));

export { useProductsStore, useProductFilterStore, useProductScrollStore, useTotalProductsLengthStore };