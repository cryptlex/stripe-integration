import { StatusCode } from "hono/utils/http-status";

export type HandlerReturn = Promise<{
    /** HTTP Status */
    status: StatusCode;
    /** Message in JSON body */
    message: string;
    /** JSON Data */
    data?: any;
}>;