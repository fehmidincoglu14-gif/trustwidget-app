import { json } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";
import db from "../db.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  // Authenticate the app proxy request to ensure it comes from Shopify
  const { session, shop } = await authenticate.public.appProxy(request);

  if (!shop) {
    return json({ error: "Unauthorized" }, { status: 401 });
  }

  const url = new URL(request.url);
  const action = url.searchParams.get("action");

  if (action === "recent-sales") {
    const recentOrder = await db.recentOrder.findFirst({
      where: { shop: shop },
      orderBy: { timestamp: "desc" },
    });
    
    if (recentOrder) {
      return json({
        success: true,
        data: {
          city: recentOrder.city || "Bir müşteri",
          productName: recentOrder.productName,
          timeAgo: Math.floor((Date.now() - recentOrder.timestamp.getTime()) / 60000) + " dakika önce"
        }
      });
    }

    // Smart Simulation Fallback (If no real orders exist yet)
    const CITIES = ["İstanbul", "Ankara", "İzmir", "Bursa", "Antalya", "Adana"];
    const randomCity = CITIES[Math.floor(Math.random() * CITIES.length)];
    const timeAgo = Math.floor(Math.random() * 59) + 1; // 1 to 59 mins ago
    
    return json({ 
      success: true, 
      data: {
        city: randomCity,
        productName: "harika bir ürün", // This should ideally be pulled from active products
        timeAgo: `${timeAgo} dakika önce`
      } 
    });
  }

  if (action === "live-visitor") {
    // For MVP phase 2: we simulate real visitors if there's no complex websocket backend.
    // In a real scenario, this would check Redis or a fast in-memory store for active sessions.
    const baseCount = Math.floor(Math.random() * 5) + 10;
    return json({
      success: true,
      data: { count: baseCount }
    });
  }

  if (action === "track-ab") {
    const variant = url.searchParams.get("variant") || "A";
    const widgetId = url.searchParams.get("widgetId") || "unknown";
    const eventType = url.searchParams.get("eventType") || "view";

    try {
      await db.abTestEvent.create({
        data: {
          shop: shop,
          widgetId: widgetId,
          variant: variant,
          eventType: eventType
        }
      });
      return json({ success: true });
    } catch (e) {
      return json({ success: false, error: "Tracking failed" }, { status: 500 });
    }
  }

  if (action === "get-reviews") {
    const productId = url.searchParams.get("productId");
    if (!productId) return json({ error: "Missing productId" }, { status: 400 });
    
    const reviews = await db.review.findMany({
      where: { shop: shop, productId: productId, isPublished: true },
      orderBy: { createdAt: "desc" },
      take: 10
    });
    return json({ success: true, data: reviews });
  }

  return json({ error: "Invalid action" }, { status: 400 });
};

export const action = async ({ request }: LoaderFunctionArgs) => {
  const { session, shop } = await authenticate.public.appProxy(request);
  if (!shop) {
    return json({ error: "Unauthorized" }, { status: 401 });
  }

  if (request.method !== "POST") {
    return json({ error: "Method not allowed" }, { status: 405 });
  }

  const formData = await request.formData();
  const actionType = formData.get("action");

  if (actionType === "submit-review") {
    const productId = formData.get("productId") as String;
    const author = formData.get("author") as String;
    const rating = parseInt(formData.get("rating") as string, 10);
    const body = formData.get("body") as String;
    
    if (!productId || !author || !rating || !body) {
      return json({ error: "Missing fields" }, { status: 400 });
    }

    try {
      const newReview = await db.review.create({
        data: {
          shop: shop,
          productId: productId.toString(),
          author: author.toString(),
          rating: rating,
          body: body.toString(),
          isPublished: true // auto-publish for MVP demo
        }
      });
      return json({ success: true, data: newReview });
    } catch (e) {
      return json({ success: false, error: "Failed to create review" }, { status: 500 });
    }
  }

  return json({ error: "Invalid action" }, { status: 400 });
};
