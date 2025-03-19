import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";;

export async function GET(req: NextRequest, {params}: {params: Promise<{ id: string }>}) {
  const { id } = await params;
  const session = await getServerSession(authOptions);

  try {
    if (!session?.user?.id) {
      return NextResponse.json({
        message: "Forbidden access"
      }, {status: 401});
    }

    const data = await prisma.review.findUnique({
      where: {
        userProductReviewId: {
          productId: id,
          userId: session.user.id,
        }
      }
    });

    return NextResponse.json({message: "Review fetched successfully", data}, {status: 200});
  } catch(e) {
    console.error("Some error occured: ", e);
    return NextResponse.json({message: "Internal server error"}, {status: 500})
  }
}