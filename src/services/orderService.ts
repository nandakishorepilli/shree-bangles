import { prisma } from "@/lib/prisma";
import { decrementStock } from "./productService";

export interface OrderItemInput {
  productId: string;
  variantId?: string;
  productName: string;
  price: number;
  quantity: number;
  color?: string;
  size?: string;
}

export interface CreateOrderInput {
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  items: OrderItemInput[];
}

/**
 * Creates an order and decrements stock for every line item.
 * If any item is out of stock, nothing is committed — the customer sees an
 * error instead of a partially-fulfilled order.
 */
export async function createOrder(input: CreateOrderInput) {
  const totalAmount = input.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return prisma.$transaction(async (tx) => {
    const order = await tx.order.create({
      data: {
        customerName: input.customerName,
        email: input.email,
        phone: input.phone,
        address: input.address,
        city: input.city,
        state: input.state,
        pincode: input.pincode,
        totalAmount,
        items: {
          create: input.items.map((item) => ({
            productId: item.productId,
            productName: item.productName,
            price: item.price,
            quantity: item.quantity,
            color: item.color,
            size: item.size
          }))
        }
      },
      include: { items: true }
    });

    for (const item of input.items) {
      await decrementStock(item.productId, item.quantity, item.variantId);
    }

    return order;
  });
}

export async function getOrders() {
  return prisma.order.findMany({
    include: { items: true },
    orderBy: { createdAt: "desc" }
  });
}
