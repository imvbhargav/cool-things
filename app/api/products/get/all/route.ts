import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET(req: NextRequest) {

  // Get the search parameters from the URL
  const { searchParams } = new URL(req.url);

  // Extract query parameters category and sort.
  const category = searchParams.get('category');
  let sort = searchParams.get('sort') ?? 'asc';
  sort = ['asc', 'desc'].includes(sort) ? sort : 'asc';

  // Extract query parameters take and skip.
  const take = parseInt(searchParams.get('take') ?? '48');
  const skip = parseInt(searchParams.get('skip') ?? '0');

  const order: Prisma.SortOrder = sort as Prisma.SortOrder;

  try {
    const products = await prisma.product.findMany({
      where:  (category && category.split(',').length > 0)
              ? { cateName: { in: [...category.split(',')] } }
              : {},
      orderBy: {
        price: order,
      },
      skip,
      take
    });

    const count = await prisma.product.count({
      where:  (category && category.split(',').length > 0)
              ? { cateName: { in: [...category.split(',')] } }
              : {},
    });

    return NextResponse.json(
      {
        message: `${products.length} products fetched successfully!`,
        count,
        products
      },{
        status: 200
      }
    );
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Internal Server Error." }, { status: 500 });
  }
}