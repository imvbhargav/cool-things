import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET() {

  const session = await getServerSession(authOptions);

  if (!session?.user?.id) return NextResponse.json({message: "Forbidden access"}, {status: 403});

  try {
    const order = await prisma.order.findUnique({
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

    return NextResponse.json({
      message: "Fetched user orders successfully",
      order
    }, {status: 200});
  } catch (error) {
    console.error("Error occured while fetching orders: ", error);
    return NextResponse.json({
      message: "Internal server error, failed to fetch orders"
    }, {status: 500});
  }
}