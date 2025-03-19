import { CartItem, Product } from "@prisma/client";
import { create } from "zustand";
import { useUserAuthStore } from "./auth";

type CartItemExtended = CartItem & {
  product: Product;
}

type ActionOnTotal = 'add' | 'sub' | 'new';

type CartTotal = {
  total: number;
  setTotal: (newTotal: number, action: ActionOnTotal) => void;
  clearTotal: () => void
}
type Cart = {
  items: CartItemExtended[] | null;
  setCart: (items: CartItemExtended[]) => void;
  addItem: (item: Product) => Promise<void>;
  removeItem: (item: CartItemExtended, todelete: boolean) => Promise<void>;
  clearCart: () => Promise<void>;
  checkout: () => Promise<void>;
}

type CartLength = {
  length: number | null;
  setLength: (count: number) => void;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
}

type CartInteraction = {
  paused: boolean;
  toggleInteraction: () => void;
}

// Store to pause/resume the interaction during cart API calls.
const useCartInteraction = create<CartInteraction>((set) => ({
  paused: false,
  toggleInteraction: () => {
    set(state => ({paused: !state.paused}));
  }
}));

// Store to access the total price of the cart.
const useCartTotalStore = create<CartTotal>((set) => ({
  total: 0,
  setTotal: (newTotal: number, action: ActionOnTotal) => {
    switch(action) {
      case "add":
        set((state) => ({total: (state.total + newTotal)}));
        break;
      case "sub":
        set((state) => ({total: (state.total - newTotal)}));
        break;
      case "new":
        set((state) => ({total: newTotal}));
        break;
    }
  },
  clearTotal: () => set((state) => ({total: 0})),
}));

// Store to access the length of cart, useful in showing no. of items in cart in sidebar.
const useCartLengthStore = create<CartLength>(
  (set) => ({
    length: null,
    setLength: (count) => set(state => ({length: count})),
    increment: () => {
      set(state => ({length: (state.length ?? 0) + 1}))
    },
    decrement: () => {
        set(state => ({length: ((state.length && state.length > 1) ? state.length : 1 ) - 1}))
    },
    reset: () => set(state => ({length: 0})),
  })
);


// Helper function to update the cart items state.
function updateCartState(state: Cart, cartItem: CartItemExtended | null) {

  // If cart item is null then remove the optimistically upated cart item.
  if (!cartItem) {

    // Decrement the cart length as cartItem null means we added new temp item.
    useCartLengthStore.getState().decrement();
    return {
      items: (state.items??[]).filter(i => i.id != 'temp')
    }
  }

  // Check the item provided already exists.
  const existingItem = (state.items??[]).find((i: CartItemExtended) => i.productId === cartItem.productId);

  // If the item to be added already exists then replace the stale item with new item.
  if (existingItem) {
    return {
      items: (state.items??[]).map((i: CartItemExtended) =>
        i.productId === cartItem.productId ? cartItem : i
      ),
    };
  }

  // Add a new item to the cart
  return {
    items: [...(state.items??[]), cartItem],
  };
}

// Helper function to call the api to add the item to the cart.
const callCartAddItemAPI = async (item: Product) => {
  try {
    const data = await fetch("/api/cart/add", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        productId: item.id,
        quantity: 1,
        price: item.price,
      }),
    });
    const { product } = (await data.json())
    return { success: true, product };
  } catch (error) {
    console.error("Some error occured while adding the item to cart");
    return { success: false, product: null };
  }
}

// Store for cart.
const useCartStore = create<Cart>(
    (set) => ({
      items: null,
      setCart: (items: CartItemExtended[]) => {

        // Update the length of the cart.
        useCartLengthStore.getState().setLength(items?.length??0);

        // Set the cart state to the received cart.
        set(state => ({items: items}));
      },
      addItem: async (item: Product) => {

        // Stop the interaction so that user can not make another call till the call completes.
        useCartInteraction.getState().toggleInteraction();

        // Get the cart item if the item to be added already exists in cart.
        const optimisticItem = (useCartStore.getState().items??[]).filter((i) => i.productId == item.id)[0];
        let optimisticCartItem: CartItemExtended;

        // If item exists then update the quantity and price.
        if (optimisticItem) {

          optimisticCartItem = {
            ...optimisticItem,
            quantity: optimisticItem.quantity + 1,
            price: item.price
          }
        } else { // If the item does not exists then create a new temp cart item.

          // Increment the cart length as this is adding new item.
          useCartLengthStore.getState().increment();

          optimisticCartItem = {
            id: 'temp',
            cartId: 'temp',
            productId: item.id,
            product: item,
            quantity: 1,
            price: item.price,
            createdAt: new Date(),
            updatedAt: new Date(),
          }
        }

        // Set the items state to the optimistically created cart item.
        set((state) => updateCartState(state, optimisticCartItem));

        // Get the response from api calling helper function.
        const response = await callCartAddItemAPI(item);

        // If the api call fails, that is item is not added to the cart, remove the,
        // optmistically added temp item, else update with the added item.
        if (!response.success) {
           set((state) => updateCartState(state, optimisticItem));
        } else {
          set((state) => updateCartState(state, response.product));
        }

        // Enable the interaction back again.
        useCartInteraction.getState().toggleInteraction();
      },
      removeItem: async (item: CartItemExtended, todelete: boolean) => {

        // Stop the interaction so that user can not make another call till the call completes.
        useCartInteraction.getState().toggleInteraction();

        // Get the state before performing updates to handle api fail.
        const cartBeforeOptimisticUpdate = useCartStore.getState().items;

        // Get the cart item to be removed or decremented in cart.
        const optimisticItem = (useCartStore.getState().items??[]).filter((i) => i.id == item.id)[0];

        // If item does not exists, do not continue.
        if (!optimisticItem) {
          alert("What are you doing at this point?");

          // Enable the interaction back again.
          useCartInteraction.getState().toggleInteraction();

          return;
        }

        // Action to perform ie, to delete the item from cart or to decrease the quantity.
        let action: string;

        // If delete is requested or the quantity is already 1 or less,
        // decrementing should remove the item.
        if (todelete || item.quantity <= 1) {

          // Since we are removing the item from cart, decrease cart length.
          useCartLengthStore.getState().decrement();

          // Set the state by removing the item.
          set((state) => (
            {
              items: state.items?.filter((i) => i.id != item.id)
            }
          ));

          // Set action to 'x', ie to delete the item.
          action = 'x';
        } else {

          // Decrease the quantity of the given item.
          set((state) => (
            {
              items: state.items?.map((i) => i.id === item.id
              ? {...i, quantity: i.quantity - 1}
              : i)}
          ));

          // Set action to '-', ie to decrease the quantity of the item.
          action = '-';
        }

        // Update the values in the database, by api call.
        const response = await fetch("/api/cart/remove", {
          method: 'POST',
          headers: {
            'Content-Type': "application/json"
          },
          body: JSON.stringify({
            productId: item.product.id,
            quantity: item.quantity,
            price: item.product.price,
            action,
          })
        });

        // If api fails set the revert the changes back to pre-update state.
        if (!response.ok) {
          set((state) => ({ items:  cartBeforeOptimisticUpdate }));
          useCartLengthStore.getState().setLength(cartBeforeOptimisticUpdate?.length??0);
          return;
        }

        // Get the data returned from the api.
        const _ = (await response.json());

        // Enable the interaction back again.
        useCartInteraction.getState().toggleInteraction();
      },
      clearCart: async () => {

        // Stop the interaction so that user can not make another call till the call completes.
        useCartInteraction.getState().toggleInteraction();

        // Store the cart before clearing to use on api error.
        const cartBeforeClear = useCartStore.getState().items??[];

        // If the cart is already empty then break.
        if (cartBeforeClear.length < 1) return;

        // Reset the cart length state to 0.
        useCartLengthStore.getState().reset();

        // Clear the cart state.
        set((state) => ({ items: [] }));

        // Get the api response and if success then continue.
        try {
          const data = await fetch("/api/cart/clear", {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          // If the response is not success the revert the cart back to previous state.
          if (data.status != 200) {
            throw new Error(`HTTP error! status: ${data.status}`);
          }
        } catch (error) { // On any error revert back the cart to previous state.
          console.error("Some error occured while clearing the cart: ", error);
          set((state) => ({ items: cartBeforeClear }));
          useCartLengthStore.getState().setLength( cartBeforeClear.length );
        } finally {

          // Enable the interaction back again.
          useCartInteraction.getState().toggleInteraction();
        }
      },
      checkout: async () => {

        // Store the cart state before checkout for rollback purposes.
        const cartBeforeCheckout = useCartStore.getState().items ?? [];

        // If cart is empty the do not initiate checkout.
        if (cartBeforeCheckout.length < 1) {
          console.warn("Cart is empty, checkout not initiated.");
          return;
        }

        // Optimistically update the cart state to an empty state.
        set((state) => ({ items: [] }));
        useCartLengthStore.getState().reset();

        try {

          // Make an API call to process the checkout.
          const response = await fetch("/api/cart/checkout", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          });

          // Handle the API response.
          if (!response.ok) {
            throw new Error(`Checkout failed: ${response.statusText}`);
          }

          const _ = await response.json();
          window.location.href = '/orders';
        } catch (error) {

          // On error, revert the cart to the previous state.
          console.error("Checkout error:", error);

          set((state) => ({ items: cartBeforeCheckout }));
          useCartLengthStore.getState().setLength(cartBeforeCheckout.length);
        }
      },
    }),
);

// Get the user's cart items.
const getCartItems = async () => {
  if (!useUserAuthStore.getState().user?.id) return;
  const data = await fetch("/api/cart/get");
  const product = (await data.json()).cart?.items??[];
  return product;
}

// Update the cart items to the received items.
getCartItems().then((items) => {
  useCartStore.setState({ items });
});

export { useCartStore, useCartTotalStore, useCartLengthStore, useCartInteraction };