import { serve } from '@hono/node-server'
import app from './lib/app'
import { version } from './package.json'

console.info(`Starting @cryptlex/stripe-integration ${version}.`);
serve({ fetch: app.fetch, port: 9890 })