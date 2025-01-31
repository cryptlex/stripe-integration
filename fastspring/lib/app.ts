import { Hono } from "hono";
import crypto from 'crypto';
// import { env } from "hono/adapter";
import createClient from "openapi-fetch";
import { paths } from "@cryptlex/web-api-types";
import { getAuthMiddleware } from "../..//utils/client.js"
import { handleOrderCreated } from "./eventHandlers/handleOrderCreated";
import { handleSubscriptionDeactivated } from "./eventHandlers/handleSubscriptionDeactivated";
import { handleSubscriptionChargeCompleted } from "./eventHandlers/handleSubscriptionChargeCompleted";
import { handleSubscriptionPaymentOverdue } from "./eventHandlers/handleSubscriptionPaymentOverdue";
import { env } from "hono/adapter";

function isValidSignature(body:any, signature:string, secret:string) {
  const computedSignature = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('base64');
  return computedSignature === signature;
}
const app = new Hono();

app.post("/v1", async (context) => {
  try {
    /**
     * To prevent the endpoint from attacks from malicious third parties spoofing fastspring webhooks event, we issue a secret
     *  and verify all the events. https://developer.fastspring.com/reference/message-security
     */
    const { CRYPTLEX_ACCESS_TOKEN, WEB_API_BASE_URL, FASTSPRING_WEBHOOK_SECRET } = env(context);

    if (typeof (CRYPTLEX_ACCESS_TOKEN) !== 'string') {
      throw Error('CRYPTLEX_ACCESS_TOKEN was not found in environment variables.');
    }
    if (typeof (WEB_API_BASE_URL) !== 'string') {
      throw Error('API_BASE_URL was not found in environment variables.');
    }
    if (typeof (FASTSPRING_WEBHOOK_SECRET) !== 'string') {
      throw Error('FASTSPRING_WEBHOOK_SECRET was not found in environment variables.');
    }

    const CtlxClient = createClient<paths>({
      baseUrl: WEB_API_BASE_URL,
    });
    /** Register middleware for authentication */
    CtlxClient.use(getAuthMiddleware(CRYPTLEX_ACCESS_TOKEN));

    const fsSignature = context.req.header('x-fs-signature'); // equivalent to req.headers['x-fs-signature']
    if (!fsSignature)
    {
      throw Error('No x-fs-signature header was found.')
    }

    const rawbody = await context.req.text();
    if (  !isValidSignature(rawbody, fsSignature, FASTSPRING_WEBHOOK_SECRET))
    {
      throw Error('The payload is tampered')
    }

  
    // Validate the signature
    const body = await context.req.json();
    const event = body.events[0];
    let result;
    switch (event.type) {
      case "order.completed":
        result = await handleOrderCreated(CtlxClient, event);
        return context.json(result, result.status);
      case "subscription.charge.completed":
        result = await handleSubscriptionChargeCompleted(CtlxClient, event);
        return context.json(result, result.status);
      case "subscription.payment.overdue":
        result = await handleSubscriptionPaymentOverdue(CtlxClient, event);
        return context.json(result, result.status);
      case "subscription.deactivated":
        result = await handleSubscriptionDeactivated(CtlxClient, event);
        return context.json(result, result.status);
      default:
        throw Error(`Webhook with event type ${event.type} is not supported.`);
    }
  } catch (error) {
    console.error(error);
    return context.json(
      {
        message:
          error && typeof error === "object" && "message" in error
            ? error.message
            : `Unexpected error ${error} in integration lambda.`,
      },
      400
    );
  }
});

export default app;
