import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  const { id, name, address, role } = await req.json();

  if (session?.user?.id != id) {
    return NextResponse.json({
      message: "Forbidded access"
    }, { status: 403 });
  }

  if (session?.user.address == address && session?.user?.name == name) {
    return NextResponse.json({
      message: "Same data provided for updating"
    }, {status: 404});
  }

  const newRole = ['USER', 'SELLER'].includes(role) ? role : 'USER';

  try {
    const updatedUser = await prisma.user.update({
      where: {
        id
      },
      data: {
        name,
        address,
        role: newRole,
      }
    });

    return NextResponse.json({
      message: "User updated successfully.",
      updatedUser
    }, {status: 200});
  } catch (error) {
    console.error("Error occured while updating user: ", error);
    return NextResponse.json({
      message: "Internal server error"
    }, {status: 500});
  }
};