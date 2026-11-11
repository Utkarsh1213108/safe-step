
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/paypal/create-order")({
  server: {
    handlers: {
      POST: async () => {
        const clientId = process.env.PAYPAL_CLIENT_ID;
        const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

        if (!clientId || !clientSecret) {
          return Response.json(
            { error: "PayPal Sandbox credentials are not configured." },
            { status: 500 }
          );
        }

        try {
          const auth = Buffer.from(
            `${clientId}:${clientSecret}`
          ).toString("base64");

          const tokenResponse = await fetch(
            "https://api-m.sandbox.paypal.com/v1/oauth2/token",
            {
              method: "POST",
              headers: {
                Authorization: `Basic ${auth}`,
                "Content-Type": "application/x-www-form-urlencoded",
              },
              body: "grant_type=client_credentials",
            }
          );

          if (!tokenResponse.ok) {
            return Response.json(
              { error: "Unable to authenticate with PayPal Sandbox." },
              { status: 502 }
            );
          }

          const tokenData = await tokenResponse.json();

          const orderResponse = await fetch(
            "https://api-m.sandbox.paypal.com/v2/checkout/orders",
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${tokenData.access_token}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                intent: "CAPTURE",
                purchase_units: [
                  {
                    description:
                      "SaferStep simulated payment-scam awareness exercise",
                    amount: {
                      currency_code: "USD",
                      value: "1.00",
                    },
                  },
                ],
                application_context: {
                  brand_name: "SaferStep Practice",
                  user_action: "PAY_NOW",
                  shipping_preference: "NO_SHIPPING",
                },
              }),
            }
          );

          const orderData = await orderResponse.json();

          if (!orderResponse.ok) {
            return Response.json(
              { error: "PayPal could not create the Sandbox order." },
              { status: 502 }
            );
          }

          const approvalUrl = orderData.links?.find(
  (link: { rel: string; href: string }) => link.rel === "approve"
)?.href;

if (!approvalUrl) {
  return Response.json(
    { error: "PayPal approval link was not returned." },
    { status: 502 }
  );
}

return Response.json({
  id: orderData.id,
  status: orderData.status,
  approvalUrl,
});
        } catch {
          return Response.json(
            { error: "PayPal Sandbox request failed." },
            { status: 500 }
          );
        }
      },
    },
  },
});
