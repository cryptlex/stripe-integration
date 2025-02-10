export function getCustomAttributes(item: any) {
    const customAttributes = item.attributes;
    const productId = customAttributes?.cryptlex_product_id;
    const licensePolicyId = customAttributes?.cryptlex_license_policy_id;
    if (typeof productId === "string" && typeof licensePolicyId === "string") {
        return {
            productId,
            licensePolicyId,
        };
    } else {
        throw Error(`Attribute type does not conform to the required type for custom attribute of product: ${item.product} `);
    }
}

export const SUBSCRIPTION_ID_METADATA_KEY = "fastspring_subscription_id";
export const ORDER_ID_METADATA_KEY = "fastspring_order_id"