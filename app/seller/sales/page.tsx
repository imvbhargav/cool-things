import prisma from "@/lib/prisma";
import Login from "@/components/Login";
import { getServerSession } from "next-auth";
import SalesItems from "@/components/SalesItems";
import SalesInsights from "@/components/SalesInsights";
import LoginContainer from "@/components/LoginContainer";
import SalesTabOptions from "@/components/SalesTabOption";
import { authOptions } from "@/lib/authOptions";import Link from "next/link";
;

async function Sales() {

  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return (
      <>
        <Login />
        <LoginContainer page="seller page" />
        <div className="fixed top-4 left-4 p-4 bg-blue-500 rounded-xl hover:bg-pink-500 transition-colors duration-300 text-black font-black">
          <Link href="/">GO TO HOME</Link>
        </div>
      </>
    );
  }
  if (session?.user?.role !== 'SELLER') {
    return (
      <div className="h-screen flex justify-center items-center p-4">
        <h1 className="text-4xl">403: Forbidden access.</h1>
      </div>
    );
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    include: {
      Sale: {
        include: {
          orderItem: {
            include: {
              product: true,
            }
          }
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: 50,
      },
    },
  });

  const sales = user?.Sale;

  return (
    <>
    {sales?.length && sales?.length > 0 ?
      <div>
        <div className="flex justify-between text-2xl bg-slate-800 rounded-xl m-2 p-4">
          <p>{session?.user.name}`&apos;s Sales overview</p>
          <p className="bg-blue-500 hover:bg-pink-500 py-2 px-4 rounded-xl border-2 border-zinc-950">
            <Link href="/seller">Back to seller dashboard</Link>
          </p>
        </div>
        <SalesInsights sales={sales} />
        <SalesTabOptions />
        <SalesItems sales={sales} />
      </div>
      :
      <div className="w-full h-screen flex flex-col justify-center items-center gap-2">
        <p className="bg-black py-2 px-6 text-2xl border border-zinc-800 rounded-md">No sales done!</p>
        <p className="bg-blue-500 hover:bg-pink-500 rounded-md py-2 px-0">
          <Link href={"/seller"} style={{padding: '0.8rem'}}>Back to seller dashboard</Link>
        </p>
      </div>
    }
    </>
  );
}

export default Sales;