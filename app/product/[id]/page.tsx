import { authOptions } from "@/lib/authOptions";;
import ProductDetails from "@/components/ProductDetails";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";
import SyncSessionWithStore from "@/components/SyncSessionWithStore";

export const dynamic = "force-dynamic";

type Params = Promise<{
  id: string;
}>;

export default async function FullProductInfo({ params }: Readonly<{ params: Params }>) {
  try {

    // Get logged-in user session information
    const session = await getServerSession(authOptions);

    // Get the product ID from the route
    const { id } = params instanceof Promise ? await params : params;

    // Fetch the product information from the database
    const product = await prisma.product.findUnique({
      where: {
        id,
      },
      include: {
        Review: {
          include: {
            user: true,
          }
        },
      }
    });

    // Product is not found
    if (!product) {
      return (
        <div className="flex w-full h-screen justify-center items-center">
          <h1>Product Not Found</h1>
          <p>The product with ID {id} does not exist.</p>
        </div>
      );
    }

    // Get 3 products that is not the current product.
    const moreProducts = await prisma.product.findMany({
      where: {
        AND: [
          {cateName: product?.cateName},
          {id: {
            not: product.id,
          }}
        ]
      },
      take: 3,
    });

    // If the user is logged in then get the items in his cart.
    let cart;
    if (session?.user?.id) {
      cart = await prisma.cart.findUnique({
        where: {
          userId: session?.user.id,
        },
        include: {
          items: {
            include: {
              product: true
            }
          }
        }
      });
    }

    // Return the product details component with session data
    return (
      <>
        <SyncSessionWithStore session={session} userCart={cart?.items} />
        <ProductDetails product={product} moreProducts={moreProducts} />
      </>
    );
  } catch (error) {
    console.error("Error fetching product or session data:", error);
    return (
      <div className="flex w-full h-screen justify-center items-center">
        <h1>Error</h1>
        <p>There was an error loading the product details. Please try again later.</p>
      </div>
    );
  }
}