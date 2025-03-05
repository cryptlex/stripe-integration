# @cryptlex/stripe-integration
A lightweight server application designed to handle `invoice.paid` and `checkout.session.completed` events from Stripe. Upon receiving these webhooks, the server will automatically create or renew licenses in Cryptlex, ensuring a seamless integration between Stripe payments and Cryptlex licenses.

## Requirements
To run this application, you must set the following environment variables in your hosting environment:

- **STRIPE_WEBHOOK_SECRET**: Your Stripe webhook secret, used to verify the authenticity of incoming Stripe events.
- **CRYPTLEX_PRODUCT_ID**: The Cryptlex Product ID corresponding to the license you want to create or renew.
- **CRYPTLEX_ACCESS_TOKEN**: A valid Cryptlex API access token with the `license:read`, `license:write`, `user:read`, `user:write` permissions; used to authenticate requests to the Cryptlex API.

## Installation & Usage
This project provides two preconfigured deployment targets based on your runtime environment:
- **AWS**: For running the server on AWS Lambda using GitHub Actions.
- **Node**: For running the server in a Node.js environment, including containerized deployments.

### AWS Lambda
To set up deployments on AWS Lambda, review the provided [aws.yml](./.github/workflows/aws.yml) GitHub Actions workflow. This file contains instructions for building, and deploying your application using GitHub Actions.

### Node
To run the application in a Node.js environment, including Docker-based workflows, refer to the [Dockerfile](./Dockerfile).

## Support
If you have questions, need assistance, or experience any issues, please feel free to reach out to our support team at [support@cryptlex.com](mailto:support@cryptlex.com). We’re here to help!