import SellerDashboard from "@/components/SellerDashboard";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import LoginContainer from "@/components/LoginContainer";
import Login from "@/components/Login";
import SyncSessionWithStore from "@/components/SyncSessionWithStore";
import prisma from "@/lib/prisma";
import Link from "next/link";

async function Seller() {
  const session = await getServerSession(authOptions);
  const data = await fetch(`https://${process.env.BASE_URL}api/seller/products/get?sellerId=${session?.user?.id}`);
  const sellerProducts = (await data.json()).products;
  const categories = await prisma.category.findMany();

  if (!session?.user) {
    return (
      <>
        <Login />
        <LoginContainer page="seller page" />
        <div className="fixed top-4 left-4 p-4 bg-blue-500 rounded-xl hover:bg-pink-500 transition-colors duration-300 text-black font-black">
          <Link href="/">GO TO HOME</Link>
        </div>
      </>
    );
  }
  if (session?.user?.role !== 'SELLER') {
    return (
      <div className="h-screen flex justify-center items-center p-4">
        <h1 className="text-4xl">403: Forbidden access.</h1>
      </div>
    );
  }

  return (
    <>
    { session?.user ?
      <>
        <SyncSessionWithStore session={session} userCart={null} />
        <SellerDashboard sellerProducts={sellerProducts} categories={categories} />
      </>
      :
      <div className="flex justify-center items-center text-4xl h-screen">
        <h1>Loading seller information...</h1>
      </div>
    }
    </>
  );
}

export default Seller;