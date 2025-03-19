import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const sellerId = url.searchParams.get('sellerId'); // Get sellerId from the query parameters

  if (!sellerId) {
    return NextResponse.json(
      { error: "Missing required fields: sellerId." },
      { status: 400 }
    );
  }

  try {
    const products = await prisma.product.findMany({
      where: {
        sellerId
      }
    });

    return NextResponse.json(
      {
        message: "Products fetched successfully.",
        products: products
      }, { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Internal Server Error." }, { status: 500 });
  }
}