import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";;

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const { id: orderItemId, status: updateStatus } = await req.json();

  try {
    if (!session?.user?.role && session?.user.role !== 'SELLER') {
      return NextResponse.json({
        message: "Unauthorized access"
      }, { status: 401 });
    }

    const sellerOrderItem = await prisma.orderItem.findUnique({
      where: {
        id: orderItemId,
      },
      select: {
        quantity: true,
        product: {
          select: {
            id: true,
            sellerId: true,
          }
        },
      }
    });

    if (sellerOrderItem?.product?.sellerId !== session.user.id) {
      return NextResponse.json({ message: "Forbidden access" }, { status: 403 });
    }

    const data = await prisma.orderItem.update({
      where: {
        id: orderItemId,
      },
      data: {
        status: updateStatus,
        paymentRef: updateStatus == 'CANCELLED' ? 'SC' : ''
      }
    });

    if (updateStatus == 'DELIVERED') {
      await prisma.product.update({
        where: {
          id: sellerOrderItem.product.id,
        },
        data: {
          stock: {
            decrement: sellerOrderItem.quantity
          }
        }
      })
    }

    return NextResponse.json({message: "Status updated successfully", data}, { status: 200 });
  } catch (error) {
    console.error("Error occured: ", error);
    return NextResponse.json({
      message: "Internal server error"
    }, { status: 500 });
  }
};