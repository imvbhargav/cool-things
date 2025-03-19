import SideBar from "@/components/SideBar";
import OrdersList from "@/components/OrdersList";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth/next";
import LoginContainer from "@/components/LoginContainer";
import Navbar from "@/components/Navbar";
import SyncSessionWithStore from "@/components/SyncSessionWithStore";
import prisma from "@/lib/prisma";
import AcceptPayment from "@/components/AcceptPayment";
import ConfirmModal from "@/components/ConfirmModal";
import ReviewModal from "@/components/ReviewModal";

async function Order() {
  const session = await getServerSession(authOptions);

  // If the user is logged in then get the count of items in his cart.
  let cart;
  let order;
  if (session?.user?.id) {

    // If the user is logged in then get the items in his cart.
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

    // Get the orders of the logged user.
    order = await prisma.order.findUnique({
      where: {
        userId: session.user.id
      },
      include: {
        orderItems: {
          include: {
            product: true,
          },
          orderBy: {
            createdAt: 'desc',
          },
        }
      }
    });
  }

  return (
    <>
      <SyncSessionWithStore session={session} userCart={cart?.items} />
      <Navbar active="orders" />
      <SideBar active="orders" />
      <AcceptPayment />
      <ConfirmModal title="Confirm Cancel" />
      <ReviewModal />
      {session ? <OrdersList orderItems={order?.orderItems??[]} /> : <LoginContainer page="orders" />}
    </>
  );
}

export default Order;