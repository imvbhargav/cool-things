"use client";

import CtaButton from "./CtaButton";
import SideBar from "@/components/SideBar";
import Navbar from "./Navbar";
import { Product, Review, User } from "@prisma/client";
import ProductCard from "./ProductCard";
import ReviewCard from "./ReviewCard";
import AcceptPayment from "./AcceptPayment";
import Image from "next/image";

// Types for products with reviews and user details.
type ReviewsWithUser = Review & {
  user: User;
};
type ProductWithReviews = Product & {
  Review: ReviewsWithUser[];
};

export default function ProductDetails({product, moreProducts}: Readonly<{product: ProductWithReviews | null | undefined, moreProducts: Product[]}>) {

  const calculateAverageRating = () => {
    const totalRating = product?.Review.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = (totalRating??0 / ((product?.Review.length??0) > 0 ? product?.Review.length??0 : 1));
    return averageRating;
  }

  return (
    <>
      <Navbar active="none" />
      <SideBar active="none" />
      <AcceptPayment />
      {product ?
      <div className="sm:pl-28 w-full h-screen bg-slate-900 rounded-xl p-2 sm:p-10 overflow-x-hidden overflow-y-scroll pb-14 sm:pb-0">
        <div className="flex flex-wrap justify-between gap-4 bg-zinc-950 rounded-xl">
          <div className="flex-1 max-w-full object-contain p-2 flex items-start justify-center">
            {product.image &&
              <div className="flex-1 min-w-[240px] max-w-full rounded-xl border-4 border-slate-900 object-contain aspect-video bg-zinc-800 overflow-hidden flex justify-center">
                <Image
                  src={product.image} alt=""
                  width={240} height={120}
                  style={{width: '100%', height: '100%', objectFit: 'contain'}}
                />
              </div>
            }
          </div>
          <div className="flex-1 flex flex-col justify-between min-w-[60%] p-2">
            <h1 className="text-2xl sm:text-6xl border-b-2 border-slate-600">{product.name}</h1>
            <div>
              <h2 className="text-xl sm:text-4xl mt-5 text-green-500">&#8377;{product.price}</h2>
              {product.offer > 0
              ?
              <p className="text-pink-500">
                {product.offer}% off {product.minQty > 0 ?`on min. order of ${product.minQty} units` : ''}.
              </p>
              :
              <p>
                {product.minQty > 0 && `min.order: ${product.minQty}`}.
              </p>
              }
            </div>
            <p className="text-base sm:text-xl py-2">{product.desc}</p>
            <div className="flex justify-between gap-1 rounded-lg overflow-hidden mt-">
              <CtaButton type={"addToCart"} item={product} disabled={product.stock < 1} />
              <CtaButton type={"buy"} item={product} disabled={product.stock < 1} />
            </div>
          </div>
        </div>
        <section className="mt-2">
          <div className="flex flex-col lg:flex-row gap-1">
            <div className="w-full flex-1 bg-zinc-950 rounded-xl p-4">
              <h1 className="text-2xl text-center">MORE INFORMATION</h1>
              <p className="whitespace-pre-line bg-slate-900 rounded-xl p-4">
                {product.fullinfo}
              </p>
            </div>
            <div className="w-full flex-1 bg-zinc-950 rounded-xl p-4">
              <h1 className="text-2xl text-center">REVIEWS</h1>
              <div className="bg-slate-900 rounded-xl p-4">
                <div className="flex items-center bg-zinc-950 rounded-md p-2 border-2 border-pink-500 text-pink-500 text-xs md:text-base text-center">
                  Rated {calculateAverageRating()} <span className="pl-2 box-content w-[10px] h-[10px] md:w-[15px] md:h-[15px] hidden md:block"><Image width={15} height={15} src="https://img.icons8.com/color/48/pixel-star.png" alt="pixel-star"/></span>s of {product.Review.length} user reveiews.
                </div>
                <div>
                  {
                    product.Review.map((review) => (
                      <ReviewCard key={review.user.id} review={review} />
                    ))
                  }
                </div>
                {product.Review.length > 1 &&
                <div className="flex justify-between mt-2">
                  <button className="bg-zinc-950 hover:bg-blue-800 rounded-md px-4 py-1">
                    &larr; Previous
                  </button>
                  <button className="bg-zinc-950 hover:bg-blue-800 rounded-md px-4 py-1">
                    Next &rarr;
                  </button>
                </div>
                }
              </div>
            </div>
          </div>
        </section>
        { moreProducts.length > 0 ?
        <section className="bg-zinc-950 rounded-xl pb-5">
          <h1 className="text-4xl text-center mt-5 py-2">MORE {product.cateName.toUpperCase()}</h1>
          <div className="flex justify-center gap-4 mt-5 flex-wrap">
            {moreProducts.map(
              (moreItem) => (<ProductCard key={moreItem.id} product={moreItem} />)
            )}
          </div>
        </section>
        :
        <h1 className="text-4xl text-center mt-5 py-2 text-red-500">More {product.cateName} are not listed.</h1>
        }
      </div>
      :
      <div className="text-center text-red-500 flex justify-center items-center h-screen">
        <h1 className="text-xl">Product not found</h1>
      </div>
      }
    </>
  );
}