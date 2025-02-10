import { CtlxClientType } from "@shared-utils/client.js";
import { HandlerReturn } from "@shared-utils/index.js";
import { getLicenseId } from "@shared-utils/licenseActions.js";
import { SUBSCRIPTION_ID_METADATA_KEY } from "../utils/getCustomAttributes.js";


export async function handleSubscriptionPaymentOverdue(client: CtlxClientType, paymentOverdueEvent: any): HandlerReturn {
    const paymentOverdueData = paymentOverdueEvent.data;
    // logic to suspend a license
    if (paymentOverdueData.state == "overdue") {
        const subscriptionId = paymentOverdueData.id;
        const licenseId = await getLicenseId(client, subscriptionId, SUBSCRIPTION_ID_METADATA_KEY);
        const license = await client.PATCH("/v3/licenses/{id}",
            {
                params: {
                    path: {
                        id: licenseId
                    }
                },
                body: {
                   suspended:true
                }
            }
        )
        if(license.error)
        {
            throw Error(`Suspension of license with licenseId: ${licenseId} failed with  error: ${license.error.code} ${license.error.message}. `);   
        }
        return {  message: "License suspended successfully.", data: { license: license.data }, status: 200 }

    } else {
        throw Error(`Failed to handle subscription.payment.overdue webhook event with Id ${paymentOverdueEvent.id} `);
    }
};