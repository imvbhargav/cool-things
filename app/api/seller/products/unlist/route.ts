import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE(req: NextRequest) {
  try {
    const { id, reason } = await req.json();

    if (reason == "SI" || reason == "HO") {
      await prisma.product.update({
        where: {
          id
        },
        data: {
          stock: 0,
        }
      });
    } else if (reason == "SP" || reason == "DL") {
      await prisma.product.delete({
        where: {
          id
        }
      });
    }

    await prisma.orderItem.updateMany({
      where: {
        productId: id,
        status: {in: ['PENDING', 'PROCESSING', 'SHIPPED']}
      },
      data: {
        status: 'CANCELLED',
        paymentRef: 'SC'
      }
    });

    return NextResponse.json({
      message: "Product deleted successfully",
    }, {status: 200});
  } catch (error) {
    console.error("Error unlisting product:", error);
    return NextResponse.json({ error: "Internal Server Error." }, { status: 500 });
  }
}