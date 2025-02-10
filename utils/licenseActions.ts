import { HandlerReturn } from ".";
import { CtlxClientType } from "./client";

export  const   createLicense = async (client:CtlxClientType, body:any): HandlerReturn =>
{
    const license = await client.POST("/v3/licenses", {
        body,
      });
      if (license.error) {
        throw Error(
          `License creation failed with error: ${license.error.code} ${license.error.message}. User with ID ${body.userId} has been created.`
        );
      }
      return {
        message: "License created successfully.",
        data: { license: license.data },
        status: 201,
      };
}

/** Get ID of a License that has the subscription ID saved in metadata  */
export async function getLicenseId(client:CtlxClientType,subscriptionId: string, subscriptionIdMetadataKey:string):Promise<string> {

    const licenses = await client.GET('/v3/licenses',
        {
            params:
            {
                query: { "metadata.key": {eq: subscriptionIdMetadataKey}, "metadata.value": {eq:subscriptionId} }
            }
        }
    )
    if (licenses.error)
    {
        throw Error(`Failed to get license with fast-spring subscriptionId: ${subscriptionId}`);

    }
    if (licenses.data.length === 1 && licenses.data[0]) {
        const licenseId = licenses.data[0].id;
        return licenseId;
    } else if (licenses.data.length > 1) {
        throw Error(`${licenses.data.length} licenses with fast-spring subscriptionId :${subscriptionId} found.`);
    } else {
        throw Error(`No license found with fast-spring subscriptionId: ${subscriptionId}`);
    }
}