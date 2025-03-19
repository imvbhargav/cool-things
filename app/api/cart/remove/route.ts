import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";;

export async function POST(req: NextRequest) {
  const { productId, quantity, price, action } = await req.json();
  const session = await getServerSession(authOptions);

  if (!['x', '-'].includes(action)) {

    return NextResponse.json({
      message: "Bad Request, Invalid usage"
    }, { status: 400 });

  }

  try {
    if (!session?.user?.id) {

      return NextResponse.json({
        message: "Unauthorized access"
      }, { status: 402 });

    }

    const userCart = await prisma.cart.upsert({
      where: { userId: session?.user?.id },
      update: {},
      create: { userId: session?.user?.id },
    });

    let product;
    let message;
    if (action == 'x' || quantity <= 1) {
      product = await prisma.cartItem.delete({
        where: {
          cartProductId: {
            cartId: userCart.id,
            productId,
          }
        }
      });
      message = "Item deleted successfully";

    } else {
      product = await prisma.cartItem.update({
        where: {
          cartProductId: {
            cartId: userCart.id,
            productId,
          }
        },
        data: {
          quantity: {
            decrement: 1,
          },
          price,
        },
        include: {
          product: true,
        }
      });
      message = "Item quantity reduced successfully";

    }

    return NextResponse.json({
      message,
      product,
    }, {status: 200});

  } catch (error) {

    console.error("Some error occured: ", error);
    return NextResponse.json({
      message: "Internal server error"
    }, {status: 500});

  }
}