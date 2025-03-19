import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) return NextResponse.json({message: "Forbidden access"}, {status: 401});

  try {
    const count = await prisma.cartItem.count({
      where: {
        cart: {
          userId: session.user.id,
        }
      }
    });

    return NextResponse.json({
      message: "Fetched cart items count successfully",
      count
    }, {status: 200});
  } catch (error) {
    console.error("Error getting cart items count", error);
    return NextResponse.json({message: "Internal server error"}, {status: 500});
  }
}