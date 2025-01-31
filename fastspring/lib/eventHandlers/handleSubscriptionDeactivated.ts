import { CtlxClientType } from "../../../utils/client.js";
import { getLicenseId } from "../../../utils/licenseActions.js";
import { HandlerReturn } from "../../../utils";
import { SUBSCRIPTION_ID_METADATA_KEY } from "../utils/getCustomAttributes.js";

export async function handleSubscriptionDeactivated(
  client: CtlxClientType,
  subscriptionDeactivatedEvent: any
): HandlerReturn {
  const subscriptionDeactivatedData = subscriptionDeactivatedEvent.data;
  // Logic to delete a license
  if (subscriptionDeactivatedData.state == "deactivated") {
    const subscriptionId = subscriptionDeactivatedData.Id;
    const licenseId = await getLicenseId(client, subscriptionId, SUBSCRIPTION_ID_METADATA_KEY);
    const license = await client.DELETE(`/v3/licenses/{id}`, {
      params: {
        path: {
          id: licenseId,
        },
      },
    });
    if (license.error) {
      throw Error(
        `Deletion of license with licenseId: ${licenseId} failed with error: ${license.error.code} ${license.error.message}.`
      );
    }
    return {
      message: "License deleted successfully.",
      data: { licenseId: licenseId },
      status: 204,
    };
  } else {
    throw Error(
      `Could not process the subscription.deactivated webhook event with Id ${subscriptionDeactivatedEvent.id} `
    );
  }
}
