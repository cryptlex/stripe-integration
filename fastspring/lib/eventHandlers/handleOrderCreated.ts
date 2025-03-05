import { CtlxClientType } from "@shared-utils/client";
import { HandlerReturn } from "@shared-utils/index";
import { createLicense } from "@shared-utils/licenseActions";
import { insertUser } from "@shared-utils/userActions";
import { getCustomAttributes, ORDER_ID_METADATA_KEY, SUBSCRIPTION_ID_METADATA_KEY } from "../utils/getCustomAttributes";


/**
 * Create a license on order.completed event (handles both one time and subscription based licenses)
 * @param data
 */
export async function handleOrderCreated(
  client: CtlxClientType,
  orderCompletedEvent: any
): HandlerReturn {
  const orderCompletedData = orderCompletedEvent.data;
  if (orderCompletedData.completed && orderCompletedData.items.length > 0) {
    const userId = await insertUser(
      orderCompletedData.customer.email,
      orderCompletedData.customer.first,
      client,
    );
    const item = orderCompletedData.items[0];
    const ids: {
      productId: string;
      licenseTemplateId: string;
    } = getCustomAttributes(item);
    let metadata;

    if (orderCompletedData.items[0]?.subscription) { // subscription based licenses
      const subscriptionId = item.subscription.id;
      metadata = [
        {
          key: SUBSCRIPTION_ID_METADATA_KEY,
          value: subscriptionId,
          viewPermissions: [],
        },
      ];
    } else { // one time licenses
      metadata = [
        {
          key: ORDER_ID_METADATA_KEY,
          value: orderCompletedData.id,
          viewPermissions: [],
        },
      ];
    }
  

    const body = {
      productId: ids.productId,
      licenseTemplateId: ids.licenseTemplateId,
      metadata: metadata,
      userId: userId,
    };
    return await createLicense(client,body)
  } else {
    throw Error(
      `Could not process the order.completed webhook event with Id ${orderCompletedEvent.id} `
    );
  }
}
