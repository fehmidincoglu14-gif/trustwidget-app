import type { ActionFunctionArgs } from "@remix-run/node";
import { authenticate } from "../shopify.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { topic, shop, payload } = await authenticate.webhook(request);

  if (topic !== "CUSTOMERS_REDACT") {
    return new Response("Unhandled webhook topic", { status: 404 });
  }

  // GDPR: Delete all personal data related to this customer
  // Since we only store anonymized data (firstName, city), we don't have PII to delete,
  // but if we did, we would delete it here.

  return new Response("Webhook processed", { status: 200 });
};
