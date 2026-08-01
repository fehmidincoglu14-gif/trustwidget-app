import type { ActionFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import db from "../db.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { topic, shop, session, admin, payload } = await authenticate.webhook(request);

  if (topic !== "ORDERS_CREATE") {
    return new Response("Unhandled webhook topic", { status: 404 });
  }

  // The payload contains the order details
  const order = payload as any;
  
  if (order.customer && order.shipping_address) {
    const firstName = order.customer.first_name || "Bir müşteri";
    const city = order.shipping_address.city || "Bilinmeyen Şehir";
    const productName = order.line_items && order.line_items.length > 0 
      ? order.line_items[0].name 
      : "Bir ürün";
    const productUrl = order.line_items && order.line_items.length > 0 && order.line_items[0].product_id
      ? `/products/${order.line_items[0].product_id}` // To be improved
      : "";

    // Save the anonymous recent order to the database
    // We will define this schema in prisma later
    try {
      await db.recentOrder.create({
        data: {
          shop: shop,
          firstName: firstName,
          city: city,
          productName: productName,
          productUrl: productUrl,
          orderCreatedAt: new Date(order.created_at),
        },
      });
    } catch (error) {
      console.error("Error saving recent order:", error);
    }
  }

  return new Response("Webhook processed", { status: 200 });
};
