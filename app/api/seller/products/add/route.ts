import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const { id, name, desc, fullinfo, cateName, image, price, stock, offer, minQty, sellerId } = await req.json();

  if (!name || !desc || !cateName || price === undefined || stock === undefined) {
    return NextResponse.json(
      { error: "Missing required fields." },
      { status: 400 }
    );
  }

  try {
    const upsertedProduct = await prisma.product.upsert({
      where: { id: id??"0" },
      update: {
        name,
        desc,
        fullinfo,
        cateName,
        image,
        price: parseFloat(price),
        stock: parseInt(stock),
        offer: parseFloat(offer)??0,
        minQty: parseInt(minQty)??1,
        sellerId,
      },
      create: {
        name,
        desc,
        fullinfo,
        cateName,
        image,
        price: parseFloat(price),
        stock: parseInt(stock),
        offer: parseFloat(offer)??0,
        minQty: parseInt(minQty)??1,
        sellerId,
      },
    });

    return NextResponse.json(
      { message: "Product upserted successfully.", product: upsertedProduct },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error upserting product:", error);
    return NextResponse.json({ error: "Internal Server Error." }, { status: 500 });
  }
}