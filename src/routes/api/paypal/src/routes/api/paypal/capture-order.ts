
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/paypal/capture-order")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const clientId = process.env.PAYPAL_CLIENT_ID;
        const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

        if (!clientId || !clientSecret) {
          return Response.json(
            { error: "PayPal credentials are not configured." },
            { status: 500 }
          );
        }

        try {
          const body = await request.json();
          const orderId = body?.orderId;

          if (
            typeof orderId !== "string" ||
            !/^[A-Z0-9-]+$/i.test(orderId)
          ) {
            return Response.json(
              { error: "A valid PayPal order ID is required." },
              { status: 400 }
            );
          }

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
              { error: "PayPal authentication failed." },
              { status: 502 }
            );
          }

          const tokenData = await tokenResponse.json();

          const captureResponse = await fetch(
            `https://api-m.sandbox.paypal.com/v2/checkout/orders/${encodeURIComponent(orderId)}/capture`,
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${tokenData.access_token}`,
                "Content-Type": "application/json",
              },
            }
          );

          const captureData = await captureResponse.json();

          if (!captureResponse.ok) {
            return Response.json(
              { error: "PayPal could not capture this order." },
              { status: 502 }
            );
          }

          return Response.json({
            id: captureData.id,
            status: captureData.status,
          });
        } catch {
          return Response.json(
            { error: "Unable to complete PayPal Sandbox capture." },
            { status: 500 }
          );
        }
      },
    },
  },
});
