import type { ActionFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import db from "../db.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { topic, shop, payload } = await authenticate.webhook(request);

  if (topic !== "SHOP_REDACT") {
    return new Response("Unhandled webhook topic", { status: 404 });
  }

  // GDPR: Delete all data related to this shop
  try {
    await db.recentOrder.deleteMany({ where: { shop: shop } });
    await db.inventoryWarning.deleteMany({ where: { shop: shop } });
  } catch (error) {
    console.error("Error deleting shop data:", error);
  }

  return new Response("Webhook processed", { status: 200 });
};
