import { OrderItem, Product } from '@prisma/client';
import { create } from 'zustand';

type OrderItemExtended = OrderItem & {
  product: Product;
}

type Modal = {
  isPaymentModalOpen: boolean;
  togglePaymentModal: () => void;
}

type TransitionModal = {
  show: boolean;
  setShow: (show: boolean) => void;
}

type ConfirmModal = {
  showConfirm: boolean;
  itemToCancel: OrderItemExtended | null;
  setShowConfirm: (showConfirm: boolean, itemToCancel?: OrderItemExtended | null) => void;
}

type ReviewModal = {
  showReview: boolean;
  itemToReview: Product | null;
  setShowReview: (showReview: boolean, itemToReview?: Product | null) => void;
}

type PageLoadingModal = {
  pageLoading: boolean;
  page: string;
  setPageLoading: (pageLoading: boolean, page: string) => void;
}

const usePaymenyModalStore = create<Modal>((set) => ({
  isPaymentModalOpen: false,
  togglePaymentModal: () => set((state) => ({isPaymentModalOpen: !state.isPaymentModalOpen})),
}));

const useModalTransitionShow = create<TransitionModal>((set) => ({
  show: true,
  setShow: (show: boolean) => {
    set({ show });
  }
}));

const useConfirmModalStore = create<ConfirmModal>((set) => ({
  showConfirm: false,
  itemToCancel: null,
  setShowConfirm: (showConfirm, itemToCancel = null) => {
    set({ showConfirm, itemToCancel });
  }
}));

const useReviewModalStore = create<ReviewModal>((set) => ({
  showReview: false,
  itemToReview: null,
  setShowReview: (showReview, itemToReview = null) => {
    set({ showReview, itemToReview });
  }
}));

const usePageLoadingStore = create<PageLoadingModal>(set => ({
  pageLoading: false,
  page: '',
  setPageLoading: (pageLoading: boolean, page: string) => {
    set({ pageLoading, page });
  }
}));

export {  usePaymenyModalStore,
          useModalTransitionShow,
          useConfirmModalStore,
          useReviewModalStore,
          usePageLoadingStore
};