import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest){
  const { name } = await req.json();
  const session = await getServerSession(authOptions);

  try {
    if (session?.user?.role !== 'SELLER') {
      return NextResponse.json({message: 'Forbidden access'}, {status: 401});
    }

    const category = await prisma.category.findUnique({
      where: {
        name
      }
    })

    if (category) {
      return NextResponse.json({
        message: `Category ${name} already exists`,
        newCategory: category
      }, { status: 409 });
    }

    const newCategory = await prisma.category.upsert({
      where: {
        name
      },
      update: {},
      create: {
        name
      }
    });

    return NextResponse.json({
      message: `Category ${name} created successfully`,
      newCategory }, { status: 201 });
  } catch (e) {
    console.error('Some error occured: ', e);
    return NextResponse.json({ message: 'Error creating new category' }, { status: 500 });
  }
}