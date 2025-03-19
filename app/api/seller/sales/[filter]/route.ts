import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";;
import { OrderStatus } from "@prisma/client";

export async function GET(req: NextRequest, { params }: { params: Promise<{ filter: OrderStatus }> }) {
  const paramFilter = (await params).filter;
  const filter = paramFilter.toUpperCase();
  const session = await getServerSession(authOptions);

  const acceptedFilters = [ OrderStatus.PENDING,
                            OrderStatus.PROCESSING,
                            OrderStatus.SHIPPED,
                            OrderStatus.DELIVERED,
                            OrderStatus.CANCELLED
                          ];

  try {
    if (!session?.user?.id) {
      return NextResponse.json({
        message: "Unauthorized access."
      }, {status: 401});
    }

    if (session?.user.role != 'SELLER') {
      return NextResponse.json({
        message: "Forbidden access."
      }, {status: 403});
    }

    let filterArr = [];
    if (!filter || !acceptedFilters.includes(filter as OrderStatus)) {
      filterArr = acceptedFilters;
    } else {
      filterArr = [filter];
    }

    const sales = await prisma.sale.findMany({
      where: {
        sellerId: session?.user?.id, // Filters sales by the logged-in seller
        orderItem: {
          status: {
            in: filterArr as OrderStatus[],
          },
        }
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        orderItem: {
          include: {
            product: true,
            order: {
              include: {
                user: true
              }
            },
          },
        },
        seller: true
      }
    });

    return NextResponse.json({
      message: "Sales retrived successfully!",
      sales,
    }, { status: 200 });
  } catch (error) {
    console.error("Some error occured", error);
    return NextResponse.json({
      message: "Internal server error",
    }, { status: 500 });
  }
}