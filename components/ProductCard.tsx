import CtaButton from "./CtaButton";
import { Product } from "@prisma/client";
import ImagePlaceholder from "./ImagePlaceholder";
import { forwardRef, type ForwardedRef } from "react";
import Image from "next/image";

type Props = { product: Product };

const ProductCard = forwardRef(function ProductCard (
  { product }: Props,
  ref: ForwardedRef<HTMLDivElement>
) {
  return (
    <div
      className="relative w-full sm:w-[355px] rounded-xl overflow-hidden bg-zinc-900 border-4 border-zinc-600 hover:border-green-600 transition-all duration-300 p-1 flex flex-col justify-between"
      ref={ref}
    >
      {
        product.image
        ?
        <div className="w-full aspect-video overflow-hidden bg-zinc-800 rounded-lg flex justify-center items-center z-0">
          <Image
            src={product.image}
            alt={product.name}
            width={240} height={120}
            style={{width: '100%', height: '100%', objectFit: 'contain'}}
          />
        </div>
        : <ImagePlaceholder text="No Image" />
      }
      <a href={`/product/${product.id}`} className="block p-2">
        <p className="text-pink-500 text-xs sm:text-base">{product.cateName}</p>
        <h1 className="border-b-2 border-zinc-800 text-xl sm:text-2xl">{product.name} &rarr;</h1>
        <p className="my-2 leading-6 text-sm sm:text-lg">{product.desc}</p>
        <p className="absolute top-0 right-0 py-2 px-2 rounded-bl-3xl text-center bg-slate-950 text-green-300 text-3xl">&#8377;{product.price}</p>
      </a>
      {product.stock < 1 && <p className="text-red-500 text-center">Out Of Stock</p>}
      <div className="flex justify-between gap-1 rounded-lg overflow-hidden">
        <CtaButton type={"addToCart"} item={product} disabled={product.stock < 1} />
        <CtaButton type={"buy"} item={product} disabled={product.stock < 1} />
      </div>
    </div>
  );
});

export default ProductCard;