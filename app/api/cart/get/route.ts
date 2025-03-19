import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/prisma";

export async function GET(){
  const session = await getServerSession(authOptions);

  try {
    if (!session?.user?.id) return NextResponse.json({message: "Forbidden access"}, {status: 401});

    const cart = await prisma.cart.findUnique({
      where: {
        userId: session.user.id,
      },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    return NextResponse.json({
      message: "Cart fetched successfully",
      cart
    }, {status: 200});
  } catch (error) {
    console.error("Error getting cart items", error);
    return NextResponse.json({message: "Internal server error"}, {status: 500});
  }
}