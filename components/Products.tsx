"use client";

import ProductCard from "@/components/ProductCard";
import { useLoadingStore } from "@/store/loading";
import { useProductScrollStore, useProductsStore, useTotalProductsLengthStore } from "@/store/products";
import { Product } from "@prisma/client";
import { useCallback, useEffect, useRef } from "react";
import SkeletonCard from "./SkeletonCard";

const NO_OF_SKELETON_CARDS = 6;

function Products({products, totalProducts}: Readonly<{products: Product[], totalProducts: number}>) {
  const observerRef = useRef<IntersectionObserver | null>(null);

  const { loading } = useLoadingStore();
  const { products: clientProducts, setProducts } = useProductsStore();
  const { scrollFilter, isLoadingMore, setScrollFilter } = useProductScrollStore();
  const { total, setTotal } = useTotalProductsLengthStore();

  const lastProductRef = useCallback((node: HTMLDivElement | null) => {
    console.log("CONSOLE", isLoadingMore, clientProducts.length >= total, products.length >= total);
    if ( isLoadingMore
      || clientProducts.length >= total
      || products.length >= total
    ) return;
    if (observerRef.current) observerRef.current.disconnect();

    observerRef.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setScrollFilter('skip', scrollFilter.skip + scrollFilter.take);
      }
    });

    if (node) observerRef.current.observe(node);
  }, [isLoadingMore, scrollFilter, setScrollFilter, total, clientProducts.length, products.length]);

  useEffect(() => {
    setTotal(totalProducts);
    setProducts(products);
  }, [products, setProducts, setTotal, totalProducts]);

  return (
    <div className="p-2 md:px-10 md:pb-10 bg-zinc-950 rounded-b-xl mb-5">
      <h1 className="text-2xl sm:text-4xl text-center">Products</h1>
      <div className="flex justify-center gap-4 mt-5 flex-wrap pb-5">
        { loading
          ?
          <>
            {[ ...Array(NO_OF_SKELETON_CARDS).keys() ].map((key) => <SkeletonCard key={key} />)}
          </>
          :
          <>
          {clientProducts.map((item, index) => (
            <ProductCard
              key={item.id}
              product={item}
              ref={ (index === (clientProducts.length - 4)) ? lastProductRef : null }
            />
          ))}
          </>
        }
        {
          isLoadingMore &&
          <>
            {[ ...Array(NO_OF_SKELETON_CARDS).keys() ].map((key) => <SkeletonCard key={key} />)}
          </>
        }
      </div>
    </div>
  );
}

export default Products;