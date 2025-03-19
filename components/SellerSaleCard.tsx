"use client";

import { useSalesStore } from "@/store/seller";
import { OrderItem, OrderStatus, Product, Sale } from "@prisma/client";
import Image from "next/image";
import { ChangeEvent } from "react";

type OrderWithProduct = OrderItem & {
  product: Product
}

type SaleWithOrderProduct = Sale & {
  orderItem: OrderWithProduct
}

function SellerSaleCard({sale}: Readonly<{sale: SaleWithOrderProduct}>) {
  const { updateSaleStatus } = useSalesStore();

  // Update the status change in DB.
  const handleStatusChange = (e: ChangeEvent<HTMLSelectElement>) => {
    updateSaleStatus(sale.orderItemId, e.target.value as OrderStatus);
  };

  return (
    <div className="p-2 bg-black border-2 border-zinc-600 rounded-xl">
      {
        sale.orderItem.product.image &&
        <div className="w-80 h-52 object-contain overflow-hidden flex items-center bg-slate-900 rounded-t-xl">
          <div className="rounded-xl w-full max-w-[350px] bg-zinc-800 flex justify-center overflow-hidden aspect-video mx-2">
            <Image
              src={sale.orderItem.product.image}
              alt={sale.orderItem.product.name}
              width={240} height={120}
              style={{width: '100%', height: '100%', objectFit: 'contain'}}
            />
          </div>
        </div>
      }
      <div className="bg-slate-900 p-2 rounded-b-xl">
        <p className="text-2xl">{sale.orderItem.product.name}</p>
        <p className="text-green-500">Unit price: &#8377;{sale.orderItem.price}</p>
        <div className="bg-black rounded-xl p-2">
          <p className="text-blue-500">Ordered quantity: {sale.orderItem.quantity}</p>
          <p className="text-green-500">Order amount: &#8377;{sale.totalAmount}</p>
        </div>
      </div>
      <div>
        <select
          className="w-full bg-black text-white p-2 focus:outline-none focus:border-none"
          onChange={handleStatusChange}
          value={sale.orderItem.status}
          disabled={['CANCELLED', 'DELIVERED'].includes(sale.orderItem.status)}
        >
          { ['PENDING', 'PROCESSING'].includes(sale.orderItem.status) &&
            <option value={OrderStatus.PENDING}>Order Received</option>
          }
          <option value={OrderStatus.SHIPPED}>Shipped</option>
          <option value={OrderStatus.DELIVERED}>Delivered</option>
          <option value={OrderStatus.PROCESSING}>Not in Stock</option>
          <option value={OrderStatus.CANCELLED}>Cancel (Other issues)</option>
        </select>
      </div>
    </div>
  );
}

export default SellerSaleCard;