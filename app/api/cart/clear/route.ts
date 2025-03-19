import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/prisma";

export async function DELETE() {
  const session = await getServerSession(authOptions);

  try {
    if (!session?.user?.id) {
      return NextResponse.json({message: "Forbidden access"}, {status: 401});
    }

    await prisma.cart.delete({
      where: {
        userId: session.user.id,
      }
    });

    return NextResponse.json({
      message: "Cart cleared successfully!"
    }, {status: 200});
  } catch (error) {
    console.error("Error during operation:", error);
    return NextResponse.json({ message: "Internal Server Error." }, { status: 500 });
  }
}