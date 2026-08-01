import type { ActionFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { topic, shop, payload } = await authenticate.webhook(request);

  if (topic !== "CUSTOMERS_DATA_REQUEST") {
    return new Response("Unhandled webhook topic", { status: 404 });
  }

  // GDPR: Provide all personal data related to this customer
  // Since we don't store PII that can be tied to a specific customer's request (like email/phone),
  // we have nothing to provide.

  return new Response("Webhook processed", { status: 200 });
};
