import { getServerSession } from 'next-auth';
import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/authOptions';
import { CartItem, OrderItem, Product } from '@prisma/client';

type CartItemExtended = CartItem & {
  product: Product;
}

type OrderItemExtended = OrderItem & {
  product: Product;
}

type LocalOrderItem = {
  productId: string;
  quantity: number;
  price: number;
  totalAmount: number;
}

// Helper function to calculate the discounted price of the product.
function calculateDiscountedTotal(quantity: number, price: number, offer: number, minQty: number): number {

  // Calculate the total price without discount.
  const totalAmount = quantity * price;

  // Check if discount is applicable, ie, if min quantity required for offer is given.
  const discountable = quantity >= minQty;

  // Calculate the discounted amount if the discount is applicable.
  const discountedAmount = discountable
                            ? (totalAmount - (totalAmount * (offer/100)))
                            : totalAmount;

  return parseFloat(discountedAmount.toFixed(2));
}

export async function POST() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const userId = session.user.id;

  try {
    // Fetch the user's cart
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty or does not exist' }, { status: 400 });
    }

    // Calculate total amount and prepare order items
    const orderItems: LocalOrderItem[] = cart.items.map((item: CartItemExtended) => {

      // Chcek if the item is in stock.
      if (item.quantity > item.product.stock) {
        throw new Error(`Insufficient stock for product: ${item.product.name}`);
      }

      // Calculate the item total after applying the offer if applicable.
      const itemTotal = calculateDiscountedTotal(item.quantity, item.product.price, item.product.offer, item.product.minQty);

      return {
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        totalAmount: itemTotal,
      };
    });

    // Find the user order
    const userOrder = await prisma.order.findUnique({
      where: {
        userId,
      },
    });

    let order;
    if (!userOrder) {
      const createdOrder = await prisma.order.create({
        data: {
          userId,
          orderItems: {
            // Add new order items when creating the order.
            create: orderItems,
          },
        },
        include: {
          orderItems: {
            include: {
              product: true,
            }
          }
        }
      });
      order = createdOrder;
    } else {
      const createdOrderItems = await Promise.all(
        orderItems.map((item) =>
          prisma.orderItem.create({
            data: {
              orderId: userOrder.id,
              ...item,
            },
            include: {
              product: true,
            },
          })
        )
      );
      order = {...userOrder, orderItems: createdOrderItems};
    }

    // Update sales.
    await Promise.all(
      order.orderItems.map((item: OrderItemExtended) =>
        prisma.sale.create({
          data: {
            sellerId: item.product.sellerId,
            orderItemId: item.id,
            totalAmount: item.totalAmount,
          }
        })
      )
    )

    // Update product stock
    const stockUpdates = cart.items.map((item: CartItemExtended) =>
      prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      })
    );

    await Promise.all(stockUpdates);

    // Clear the cart
    await prisma.cartItem.deleteMany({
      where: { cartId: cart.id },
    });

    return NextResponse.json({
      message: 'Order created successfully',
    }, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}