import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function POST(req: NextRequest) {
  const { item, qty = 1 } = await req.json();

  const product = item.product??item;

  const session = await getServerSession(authOptions);

  if (!session?.user?.id) return NextResponse.json({message: "Forbidden access"}, {status: 401});

  try {
    const userOrders = await prisma.order.upsert({
      where: {
        userId: session.user.id
      },
      update: {},
      create: {
        userId: session.user.id,
      }
    });

    const addedOrder = await prisma.orderItem.create({
      data: {
        orderId: userOrders.id,
        productId: product.id,
        quantity: item.quantity??qty,
        price: product.price,
        totalAmount: (item.quantity??qty) * product.price,
      }
    });

    await prisma.sale.create({
      data: {
        sellerId: product.sellerId,
        orderItemId: addedOrder.id,
        totalAmount: addedOrder.totalAmount,
      }
    });

    return NextResponse.json({
      message: "Product ordered successfully",
      order: addedOrder
    }, {
      status: 200
    });
  } catch (error) {
    console.error("Error occured while ordering product: ", error);
    return NextResponse.json({
      message: "Internal server error, failed to order"
    }, {status: 500});
  }
}