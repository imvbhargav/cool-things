import { OrderItem, Product, Sale } from "@prisma/client";

type OrderWithProduct = OrderItem & {
  product: Product
}

type SaleWithOrderProduct = Sale & {
  orderItem: OrderWithProduct
}

function SalesInsights({sales}: Readonly<{sales: SaleWithOrderProduct[]}>) {

  const salesWorth = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
  return (
    <div className="bg-blue-900 rounded-xl p-2 m-2">
      <h1 className="text-center text-2xl bg-black rounded-xl p-2">Sales Insights:</h1>
      <div className="flex justify-between text-xl py-2 gap-2">
        <div className="py-2 px-4 bg-pink-700 border-2 border-black rounded-xl">
          <p className="text-md">Items sold: </p><p className="text-black text-2xl font-black">{sales.length}</p>
        </div>
        <div className="py-2 px-4 bg-green-700 border-2 border-black rounded-xl">
          <p className="text-md">Total revenue: </p><p className="text-black text-2xl font-black">&#8377;{salesWorth}</p>
        </div>
      </div>
    </div>
  );
}

export default SalesInsights;