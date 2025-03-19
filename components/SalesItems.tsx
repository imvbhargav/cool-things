"use client";

import { useSalesStore } from "@/store/seller";
import { OrderItem, Product, Sale } from "@prisma/client"
import { useEffect } from "react";
import SellerSaleCard from "./SellerSaleCard";
import { useLoadingStore } from "@/store/loading";

type OrderWithProduct = OrderItem & {
  product: Product
}

type SaleWithOrderProduct = Sale & {
  orderItem: OrderWithProduct
}

function SalesItems({ sales }: Readonly<{ sales:  SaleWithOrderProduct[] }>) {

  const { sales: saleOrderItems, setSales } = useSalesStore();
  const { loading } = useLoadingStore();

  useEffect(() => {
    setSales(sales);
  }, [sales, setSales]);

  return (
      <div className="m-2 mt-0 flex flex-wrap justify-center gap-2 bg-zinc-800 rounded-b-xl py-4">
      { loading
        ?
        <p>Loading...</p>
        :
        <>
          { saleOrderItems?.length > 0
            ?
            <>
              {saleOrderItems.map((sale) => (
                <SellerSaleCard key={sale.id} sale={sale} />
              ))}
            </>
            :
            <h2>No data found!</h2>
          }
        </>
      }
      </div>
  );
}

export default SalesItems;