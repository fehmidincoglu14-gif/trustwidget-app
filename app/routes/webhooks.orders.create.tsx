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
  
  if (order.shipping_address) {
    const city = order.shipping_address.city || "Bilinmeyen Şehir";
    const country = order.shipping_address.country || "";
    const productName = order.line_items && order.line_items.length > 0 
      ? order.line_items[0].name 
      : "Bir ürün";

    // Save the anonymous recent order to the database
    try {
      await db.recentOrder.create({
        data: {
          shop: shop,
          city: city,
          country: country,
          productName: productName,
          timestamp: new Date(order.created_at),
        },
      });
    } catch (error) {
      console.error("Error saving recent order:", error);
    }
  }

  return new Response("Webhook processed", { status: 200 });
};
