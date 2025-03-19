import ControlBar from "@/components/ControlBar";
import Navbar from "@/components/Navbar";
import Products from "@/components/Products";
import SideBar from "@/components/SideBar";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import SyncSessionWithStore from "@/components/SyncSessionWithStore";
import AcceptPayment from "@/components/AcceptPayment";
import { authOptions } from "@/lib/authOptions";

export default async function Home() {

  // Get the session of the logged in user.
  const session = await getServerSession(authOptions);

  // Get the products.
  const products = await prisma.product.findMany({
    orderBy: {
      price: 'asc',
    },
    take: 48,
  });

  const categories = await prisma.category.findMany();

  // If the user is logged in then get the items in his cart.
  let cart;
  if (session?.user?.id) {
    cart = await prisma.cart.findUnique({
      where: {
        userId: session?.user.id,
      },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });
  }

  const totalProducts = await prisma.product.count();

  return (
    <div className="flex relative m-auto">
      <SyncSessionWithStore session={session} userCart={cart?.items} />
      <Navbar active="home" />
      <SideBar active={"home"} />
      <AcceptPayment />
      <div className="absolute right-0 bg-zinc-900 p-2 sm:pl-32 h-[100dvh] rounded-r-xl sm:pr-12 overflow-y-scroll no-scrollbar w-full pb-14 sm:pb-0">
        <h1 className="text-2xl sm:text-4xl text-center py-5">Coolest products found around the world!</h1>
        <ControlBar categories={categories} />
        <Products products={products} totalProducts={totalProducts} />
      </div>
    </div>
  );
}