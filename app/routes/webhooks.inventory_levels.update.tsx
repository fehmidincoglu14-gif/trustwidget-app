import type { ActionFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import db from "../db.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { topic, shop, session, admin, payload } = await authenticate.webhook(request);

  if (topic !== "INVENTORY_LEVELS_UPDATE") {
    return new Response("Unhandled webhook topic", { status: 404 });
  }

  // The payload contains the inventory level details
  const inventoryLevel = payload as any;
  
  if (inventoryLevel.inventory_item_id && inventoryLevel.available !== undefined) {
    try {
      // Find the product related to this inventory item via Admin API or store it
      // For the MVP, we just store the warning if available is low (e.g. <= 5)
      if (inventoryLevel.available > 0 && inventoryLevel.available <= 5) {
         // Store the low stock warning
         await db.inventoryWarning.upsert({
           where: { 
             shop_inventoryItemId: { 
               shop: shop, 
               inventoryItemId: inventoryLevel.inventory_item_id.toString() 
             } 
           },
           update: {
             available: inventoryLevel.available,
             updatedAt: new Date(),
           },
           create: {
             shop: shop,
             inventoryItemId: inventoryLevel.inventory_item_id.toString(),
             available: inventoryLevel.available,
           }
         });
      } else if (inventoryLevel.available <= 0 || inventoryLevel.available > 5) {
         // Remove warning if out of stock or stock is replenished above threshold
         await db.inventoryWarning.deleteMany({
           where: {
             shop: shop,
             inventoryItemId: inventoryLevel.inventory_item_id.toString(),
           }
         });
      }
    } catch (error) {
      console.error("Error processing inventory level:", error);
    }
  }

  return new Response("Webhook processed", { status: 200 });
};
