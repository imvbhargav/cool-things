import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest, {params}: {params: Promise<{ id: string }>}) {
  const { id } = await params;

  try {
    const product = await prisma.product.findUnique({
      where: {
        id
      }
    })

    return NextResponse.json(
      {
        message: "Product fetched successfully!",
        product
      }, { status: 200 });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json({ error: "Internal Server Error." }, { status: 500 });
  }
}