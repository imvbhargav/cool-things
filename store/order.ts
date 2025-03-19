import { OrderItem, Product } from "@prisma/client";
import { create } from "zustand";

type Status = "ordered" | "shipped" | "delivered" | "failed";

type OrderItemExtended = OrderItem & {
  product: Product;
}

type Order = {
  orders: OrderItemExtended[];
  setOrder: (items: any) => void;
  addOrders: (items: Product, qty?: number) => Promise<void>;
  clearOrders: () => void;
  cancelOrder: (id: string) => Promise<void>;
};

type OrderType = 'buy' | 'checkout';

type OrderItemType = {
  order: {
    item: Product | null;
    type: OrderType;
  }
  setType: (item: Product | null, type: OrderType) => void;
}

function formatDateTime(date: Date) {
  const padZero = (num: number) => num.toString().padStart(2, '0');

  const day = padZero(date.getDate());
  const month = padZero(date.getMonth() + 1);
  const year = date.getFullYear();

  const hours = padZero(date.getHours());
  const minutes = padZero(date.getMinutes());
  const seconds = padZero(date.getSeconds());

  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
}

const useOrderStore = create<Order>(
    (set) => ({
      orders: [],
      setOrder: (items) => set((state) => ({ orders: items })),
      addOrders: async (item: Product, qty = 1) => {
        const data = await fetch("/api/order/add", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            item,
            qty
          })
        });
        if (!data.ok) {
          console.error("Some error occured processing payment");
          return;
        }
        const _ = await data.json();
        window.location.href = '/orders';
      },
      clearOrders: () => set((state) => ({ orders: [] })),
      cancelOrder: async (id: string) => {
        set((state) => ({
          orders: state.orders.map((order) =>
            order.id === id
              ? {
                  ...order,
                  status: 'CANCELLED'
                }
              : order
          ),
        }));

        const response = await fetch('/api/order/cancel', {
          method: 'POST',
          headers: {
            'Content-Type':'application/json'
          },
          body: JSON.stringify({
            id
          })
        });

        if (!response.ok) {
          console.error("Some error occured while cancelling, can't cancel");
          return;
        }

        const _ = await response.json();
      }
    })
);

const useOrderTypeStore = create<OrderItemType>(
  (set) => ({
    order: {item: null, type: 'checkout'},
    setType: (item, type) => {
      set((state) => ({order: { item, type }}));
    },
  }),
);

export { useOrderStore, useOrderTypeStore };