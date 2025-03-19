import { authOptions } from "@/lib/authOptions";;
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { productId, rating, review } = await req.json();
  const session = await getServerSession(authOptions);

  try {

    if (!session?.user?.id) {
      return NextResponse.json({ message: "Forbidden access" }, { status: 401 });
    }

    const data = await prisma.review.upsert({
      where: {
        userProductReviewId: {
          productId,
          userId: session.user.id,
        }
      },
      update: {
        rating,
        content: review,
      },
      create: {
        productId,
        userId: session.user.id,
        rating,
        content: review,
      }
    });

    return NextResponse.json({ message: "Review added successfully", data }, { status: 200 });
  } catch(e) {
    console.error("Some error occured: ", e);
    return NextResponse.json({ message: "Internal server error" }, {status: 500});
  }
}