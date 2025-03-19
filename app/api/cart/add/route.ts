import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { productId, quantity, price } = await req.json();
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userCart = await prisma.cart.upsert({
      where: { userId: session.user.id },
      update: {},
      create: { userId: session.user.id },
    });

    const product = await prisma.cartItem.upsert({
      where: {
        cartProductId: {
          cartId: userCart.id,
          productId,
        }
      },
      update: {
        quantity: {
          increment: 1,
        },
        price
      },
      create: {
        cartId: userCart.id,
        productId,
        quantity,
        price
      },
      include: {
        product: true,
      }
    });

    return NextResponse.json(
      { message: "Product added to cart successfully!", product },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error during operation:", error);
    return NextResponse.json({ message: "Internal Server Error." }, { status: 500 });
  }
}