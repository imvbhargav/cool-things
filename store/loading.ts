import { create } from "zustand";

type LoadingStoreType = {
  loading: boolean;
  setLoading: (isLoading: boolean) => void;
  toggleLoading: () => void;
};

const useLoadingStore = create<LoadingStoreType>(
  (set) => ({
    loading: false,
    setLoading: (isLoading: boolean) => {
      set(state => ({ loading: isLoading }));
    },
    toggleLoading: () => {
      set(state => ({ loading: !state.loading }));
    },
  })
);

export { useLoadingStore };