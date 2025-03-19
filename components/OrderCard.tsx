import { OrderItem, Product } from "@prisma/client";
import OrderButton from "./OrderButton";
import Image from "next/image";

type OrderItemExtended = OrderItem & {
  product: Product;
}

const statusBGColor = {
  PENDING: "bg-blue-950",
  PROCESSING: "bg-blue-950",
  CANCELLED: "bg-red-950",
  SHIPPED: "bg-slate-900",
  DELIVERED: "bg-green-950"
}

function formatDate(date: Date) {
  const formattedDate = new Intl.DateTimeFormat('en-GB', {
    weekday: 'short', // Short weekday (e.g., Tue)
    day: '2-digit',   // Day as 2 digits (e.g., 28)
    month: 'short',   // Short month name (e.g., Jan)
    year: 'numeric',  // Full year (e.g., 2025)
    timeZone: 'UTC',  // Ensure UTC is used
  }).format(date);

  return formattedDate;
}

export default function OrderCard({order}: Readonly<{order: OrderItemExtended}>) {

  const discountOnProduct = parseFloat(((order.product.price * order.quantity) * (order.product.offer / 100)).toFixed(2));

  // Calculate the percentages for order status bar gradient.
  const deliveredPendingStatus: number = order.status == 'DELIVERED' ? 100 : 0;
  const orderStatus: number = order.status == 'SHIPPED' ? 50 : deliveredPendingStatus;

  const showDiscount =  order.quantity >= order.product.minQty
                        && order.product.offer > 0
                        && order.status != 'CANCELLED';

  return (
    <div className={`flex flex-col md:flex-row ${statusBGColor[order.status]} rounded-md p-2 mb-4 relative border-2 border-zinc-600`}>
      <div className="w-full flex-1 flex max-w-96 bg-zinc-800 rounded-xl items-center justify-center min-w-40">
      {order.product.image &&
        <div className="w-full rounded-md aspect-video flex-1 object-contain flex justify-center">
          <Image
            width={240} height={120}
            src={order.product.image}
            alt={order.product.name}
            style={{width: '100%', height: '100%', objectFit: 'contain'}}
          />
        </div>
      }
      </div>
      <div className="min-w-[240px] p-0 mt-4 md:mt-0 md:pl-4 flex-1 flex flex-col justify-between">
        <h2 className="text-3xl">{order.product.name}</h2>
        <div className="text-green-500 flex flex-wrap gap-1 sm:text-xl">
          <p><span className="text-white">Quantity: </span>{order.quantity}</p>
          <p className="text-pink-500">|</p>
          <p><span className="text-white">Price: </span>&#8377;{order.price}</p>
          <p className="text-pink-500">|</p>
          <p><span className="text-white">Total Amout: </span>&#8377;{order.totalAmount}</p>
        </div>
        { showDiscount &&
          <div>
            Discount: <span className="text-pink-500">&#8377;{discountOnProduct} ({order.product.offer}%)</span>
          </div>
        }
        { order.status == 'CANCELLED' &&
          <div>
            <span className="text-pink-500">
              {order.paymentRef == 'UC' ? "You " : "Seller "}
              cancelled the order on {formatDate(order.updatedAt)}
            </span>
          </div>
        }
        {order.status != 'CANCELLED' &&
        <>
          <div className="w-full flex justify-between items-center mt-5 text-xs lg:text-sm">
            <span>{formatDate(order.createdAt)}</span>
            <span>
              { order.status === 'SHIPPED'
                ? formatDate(order.updatedAt)
                : ( order.status === 'DELIVERED' ? "" : "Pending" )
              }
            </span>
            <span>{order.status === 'DELIVERED' ? formatDate(order.updatedAt) : "Delivery pending"}</span>
          </div>
          <div
            style={
              {background: `linear-gradient(to right, #166534 ${orderStatus}%, #374151 ${orderStatus + 50}% )`}
            }
            className="w-full bg-gray-800 h-1 rounded-full flex justify-between items-center my-2"
          >
            <span className={`h-4 w-4 bg-green-800 rounded-full`}></span>
            <span
              className={`h-4 w-4 ${['SHIPPED', 'DELIVERED'].includes(order.status) ? 'bg-green-800': 'bg-gray-700'} rounded-full`}
            ></span>
            <span
              className={`h-4 w-4 ${['DELIVERED'].includes(order.status) ? 'bg-green-800': 'bg-gray-700'} rounded-full`}
            ></span>
          </div>
          <div className="w-full flex justify-between items-center mb-5">
            <span className="text-green-500">Ordered</span>
            <span className={`${(['SHIPPED', 'DELIVERED'].includes(order.status)
              ? 'text-green-500' : 'text-white')}`}>
              Shipped
            </span>
            <span className={`${(['DELIVERED'].includes(order.status) ? 'text-green-500' : 'text-white')}`}>
              Delivered
            </span>
          </div>
        </>
        }
        <div className="sm:text-xl rounded-md flex gap-1 overflow-hidden">
          <OrderButton status={order.status} order={order} />
        </div>
      </div>
    </div>
  );
}