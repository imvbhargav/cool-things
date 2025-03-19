"use client";

import { useOrderStore } from "@/store/order";
import OrderCard from "./OrderCard";
import { OrderItem, Product, OrderStatus } from "@prisma/client";
import { useEffect } from "react";

type OrderItemExtended = OrderItem & {
  product: Product;
}

// Function to calculate the total price of all orders
const calculateTotalPrice = (orders: OrderItemExtended[]): number => {
  return orders
    .filter(order => order.status != 'CANCELLED')
    .reduce((sum, order) => sum + order.totalAmount, 0);
};

// Function to calculate the total price of canceled orders
const calculateCancelledPrice = (orders: OrderItemExtended[]): number => {
  return orders
    .filter(order => order.status == 'CANCELLED')
    .reduce((sum, order) => sum + order.totalAmount, 0);
};

// Function to calculate the total price of shipped orders
const calculatePriceWithStatus = (orders: OrderItemExtended[], status: OrderStatus[]): number => {
  return orders
    .filter(order => status.includes(order.status))
    .reduce((sum, order) => sum + order.totalAmount, 0);
};

// Function to calculate the total number of orders
const calculateTotalOrders = (orders: OrderItemExtended[]): number => {
  return orders.filter(order => order.status != 'CANCELLED').length;
};

// Function to calculate the total number of canceled orders
const calculateCancelledOrders = (orders: OrderItemExtended[]): number => {
  return orders.filter(order => order.status == 'CANCELLED').length;
};

// Function to calculate the total number of shipped orders
const calculateOrdersWithStatus = (orders: OrderItemExtended[], status: OrderStatus[]): number => {
  return orders.filter(order => status.includes(order.status)).length;
};

function OrdersList({orderItems}: Readonly<{orderItems: OrderItemExtended[]}>) {

  const { orders, setOrder } = useOrderStore();

  useEffect(() => {
    setOrder(orderItems);
  }, [orderItems, setOrder]);

  const totalOrders = calculateTotalOrders(orders);
  const cancelledOrders = calculateCancelledOrders(orders);
  const pendingOrders = calculateOrdersWithStatus(orders, ['PENDING', 'PROCESSING']);
  const shippedOrders = calculateOrdersWithStatus(orders, ['SHIPPED']);
  const deliveredOrders = calculateOrdersWithStatus(orders, ['DELIVERED']);

  const totalPrice = calculateTotalPrice(orders);
  const cancelledPrice = calculateCancelledPrice(orders);
  const pendingPrice = calculatePriceWithStatus(orders, ['PENDING', 'PROCESSING']);
  const shippedPrice = calculatePriceWithStatus(orders, ['SHIPPED']);
  const deliveredPrice = calculatePriceWithStatus(orders, ['DELIVERED']);

  return(
      <div className="absolute right-0 bg-zinc-900 p-2 sm:pl-32 h-screen rounded-r-xl overflow-y-scroll no-scrollbar w-full pb-14 sm:pb-0 sm:pr-12">
        <h1 className="text-xl sm:text-4xl text-center py-5">Your orders are here, or maybe with you!</h1>
        <div className="bg-zinc-800 p-5 flex flex-col-reverse lg:flex-row gap-4 rounded-xl mb-5">
          <div className="flex-1 relative">
            {orders.map(
              order => (
                <OrderCard key={order.id} order={order} />
              )
            )}
          </div>
          <div className="md:max-w-[360px] min-w-[240px] max-h-[480px] gap-2 flex-1 rounded-md bg-slate-950 p-5 flex flex-col justify-between">
            <div className="bg-slate-950 border-2 border-green-900 p-2 rounded-md sm:text-2xl">
              <p className="flex justify-between text-right">Total: <span className="text-green-500">{totalOrders}</span></p>
              <p className="flex justify-between text-right">Worth: <span className="text-green-500">&#8377;{parseFloat(totalPrice.toFixed(2))}</span></p>
            </div>
            <div className="bg-green-950 p-2 rounded-md sm:text-2xl">
              <p className="flex justify-between text-right">Orders delivered: <span className="text-green-500">{deliveredOrders}</span></p>
              <p className="flex justify-between text-right">Worth: <span className="text-green-500">&#8377;{parseFloat(deliveredPrice.toFixed(2))}</span></p>
            </div>
            <div className="bg-slate-900 p-2 rounded-md sm:text-2xl">
              <p className="flex justify-between text-right">Orders shipped: <span className="text-yellow-500">{shippedOrders}</span></p>
              <p className="flex justify-between text-right">Worth: <span className="text-yellow-500">&#8377;{parseFloat(shippedPrice.toFixed(2))}</span></p>
            </div>
            <div className="bg-blue-950 p-2 rounded-md sm:text-2xl">
              <p className="flex justify-between text-right">To be shipped: <span className="text-blue-500">{pendingOrders}</span></p>
              <p className="flex justify-between text-right">Worth: <span className="text-blue-500">&#8377;{parseFloat(pendingPrice.toFixed(2))}</span></p>
            </div>
            <div className="bg-red-950 p-2 rounded-md sm:text-2xl">
              <p className="flex justify-between text-right">Orders cancelled: <span className="text-red-500">{cancelledOrders}</span></p>
              <p className="flex justify-between text-right">Worth: <span className="text-red-500">&#8377;{parseFloat(cancelledPrice.toFixed(2))}</span></p>
            </div>
          </div>
        </div>
      </div>
  );
}

export default OrdersList;