import app from './lib/app'
import { handle } from 'hono/aws-lambda'
import { version } from '../package.json'

console.info(`Starting @cryptlex/stripe-integration ${version}.`);
export const handler = handle(app)