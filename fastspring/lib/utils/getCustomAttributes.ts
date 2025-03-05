export function getCustomAttributes(item: any) {
    const customAttributes = item.attributes;
    const productId = customAttributes?.cryptlex_product_id;
    const licenseTemplateId = customAttributes?.cryptlex_license_template_id;
    if (typeof productId === "string" && typeof licenseTemplateId === "string") {
        return {
            productId,
            licenseTemplateId,
        };
    } else {
        throw Error(`Attribute type does not conform to the required type for custom attribute of product: ${item.product} `);
    }
}

export const SUBSCRIPTION_ID_METADATA_KEY = "fastspring_subscription_id";
export const ORDER_ID_METADATA_KEY = "fastspring_order_id"