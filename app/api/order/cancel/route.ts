import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { id } = await req.json();

  const session = await getServerSession(authOptions);

  if (!session?.user?.id) return NextResponse.json({message: "Forbidden access"}, {status: 401});

  try {
    await prisma.orderItem.updateMany({
      where: {
        id: id,
        order: {
          userId: session?.user.id,
        },
      },
      data: {
        status: 'CANCELLED',
        paymentRef: 'UC'
      },
    });

    return NextResponse.json({ message: "Order Cancelled successfully" }, { status: 200 });
  } catch (e) {
    console.error("Some error occured: ", e);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}