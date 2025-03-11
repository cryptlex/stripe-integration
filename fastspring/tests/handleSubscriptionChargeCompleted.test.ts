import createClient from "openapi-fetch";
import { afterAll, afterEach, beforeAll, expect, test, vi } from "vitest";
import type { paths } from "@cryptlex/web-api-types"; // generated by openapi-typescript
import { server } from "../../mock-server/node";
import { baseURL as MswBaseUrl } from "../../mock-server/handlers";
import { handleSubscriptionChargeCompleted } from "../lib/eventHandlers/handleSubscriptionChargeCompleted";


beforeAll(() => {
  // NOTE: server.listen must be called before `createClient` is used to ensure
  // the msw can inject its version of `fetch` to intercept the requests.
  server.listen({
    onUnhandledRequest: (request) => {
      throw new Error(
        `No request handler found for ${request.method} ${request.url}`
      );
    },
  });
});

afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test("Handle Subscription Charge Completed flow", async () => {
  const client = createClient<paths>({
    baseUrl: MswBaseUrl,
  });

  await handleSubscriptionChargeCompleted(client, {"id":"qwerty",
    "data": {
  
    "currency":"INR","quote":null,"total":2152.32,"status":"successful", "order":{"items": [
        {
          "product": "example-subscription-monthly",
          "quantity": 2,
          "display": "Example Subscription - Monthly",
          "sku": "SKU1234",
          "subtotal": 60,
          "subtotalDisplay": "$60.00",
          "subtotalInPayoutCurrency": 60,
          "subtotalInPayoutCurrencyDisplay": "$60.00",
          "discount": 0,
          "discountDisplay": "$0.00",
          "discountInPayoutCurrency": 0,
          "discountInPayoutCurrencyDisplay": "$0.00",
          "subscription": "5FR37HFYTOyXUenU75CSrA",
          "fulfillments": {
            "instructions": "Thank you for subscribing to Example Subscription Monthly. Please download the installer file using the button or link found on this page. Your license key is also displayed here."
          }
        }
      ]},"timestamp":1738046653585,
      "timestampValue":1738046653585,"timestampInSeconds":1738046653,
      "timestampDisplay":"28/01/25","timestampDisplayISO8601":"2025-01-28","sequence":1,"periods":null,"account":"qnYDZEU4Qxif6obT805fFA","subscription":{"id":"YiJdBYzzT92VsN-t3FTIwQ"}
    }})
}
)

