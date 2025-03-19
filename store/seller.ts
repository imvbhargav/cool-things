import { OrderItem, OrderStatus, Product, Sale } from "@prisma/client";
import { create } from "zustand";
import { useLoadingStore } from "./loading";

type OrderWithProduct = OrderItem & {
  product: Product
}

type SaleWithOrderProduct = Sale & {
  orderItem: OrderWithProduct
}

type SalesStoreTypes = {
  sales: SaleWithOrderProduct[];
  setSales: (sales: SaleWithOrderProduct[]) => void;
  getSalesOfStatus: (status: OrderStatus | 'all') => Promise<void>;
  updateSaleStatus: (id: string, status: OrderStatus) => Promise<void>;
}

type ActiveSaleTabTypes = {
  active: string,
  setActive: (status: OrderStatus | 'all') => void;
}

const acceptedFilters = [ OrderStatus.PENDING,
                          OrderStatus.PROCESSING,
                          OrderStatus.SHIPPED,
                          OrderStatus.DELIVERED,
                          OrderStatus.CANCELLED,
                          'all'
                        ];

const useSalesStore = create<SalesStoreTypes>(
  (set) => ({
    sales: [],
    setSales: (sales) => {
      set((state) => ({sales: sales}))
    },
    getSalesOfStatus: async (status) => {

      set((state) => (
        { sales: state.sales.filter(item => item.orderItem.status === status) }
      ));

      useActiveSaleTab.getState().setActive(status);

      if (!acceptedFilters.includes(status)) {
        console.error("Invalid status provided");
        return;
      }

      if (status == OrderStatus.PROCESSING) {
        status = OrderStatus.PENDING;
      }

      useLoadingStore.getState().setLoading(true);

      const data = await fetch(`/api/seller/sales/${status.toLowerCase()}`);

      if (!data.ok) {
        useLoadingStore.getState().setLoading(false);
        const { message } = await data.json();
        console.error(message);
        return;
      }

      const { sales } = await data.json();

      useLoadingStore.getState().setLoading(false);

      (set (state => ({sales: sales})));
    },
    updateSaleStatus: async (id: string, status: OrderStatus) => {

      set((state) => (
        {
          sales: state.sales?.map((i) => i.orderItemId === id
          ? {...i, orderItem: {...i.orderItem, status}}
          : i)}
      ));

      const response = await fetch("/api/seller/sales/order/update", {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id, status
        })
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Some error occured: ", data.message);
        alert("Some error occured updating order status.");
        return;
      }

      if (useActiveSaleTab.getState().active !== 'all')
        set(state => ({ sales: state.sales.filter(item => item.orderItemId != data.data.id) }));
    },
  })
);

const useActiveSaleTab = create<ActiveSaleTabTypes>(
  (set) => ({
    active: 'all',
    setActive: (status: OrderStatus | 'all') => {
      switch (status) {
        case "PENDING":
        case "PROCESSING":
          set(state => ({ active: 'new' }));
          break;
        case "SHIPPED":
          set(state => ({ active: 'ship' }));
          break;
        case "DELIVERED":
          set(state => ({ active: 'deliver' }));
          break;
        case "CANCELLED":
          set(state => ({ active: 'cancel' }));
          break;
        default:
          set(state => ({ active: 'all' }));
      }
    },
  })
);

export { useSalesStore, useActiveSaleTab };