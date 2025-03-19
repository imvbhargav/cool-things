import SideBar from "@/components/SideBar";
import CartList from "@/components/CartLists";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";;
import LoginContainer from "@/components/LoginContainer";
import Navbar from "@/components/Navbar";
import prisma from "@/lib/prisma";
import SyncSessionWithStore from "@/components/SyncSessionWithStore";
import AcceptPayment from "@/components/AcceptPayment";

async function Cart() {

  // Get the logged in users session details.
  const session = await getServerSession(authOptions);

  // Get the logged in user's cart information.
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

  return (
    <>
      <SyncSessionWithStore session={session} userCart={cart?.items} />
      <Navbar active="cart" />
      <SideBar active="cart" cartCount={cart?.items.length} />
      <AcceptPayment />
      {session ? <CartList /> : <LoginContainer page="the cart" />}
    </>
  );
}

export default Cart;