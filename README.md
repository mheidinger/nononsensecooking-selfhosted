# NoNonsenseCooking - Selfhosted Edition

The original [NoNonsenseCooking](https://github.com/riesinger/nononsensecooking) is a modern website for curated recipes
trying to cut out all of the unnecessary bloat of typical cooking websites developed by [@riesinger](https://github.com/riesinger).

This repo contains a heavily modified version of that site which is focused on selfhosting it for a (private) recipe collection.
Therefore it is set up to work behind a proxy with optional authentication and minimal external dependencies.

## Modification to the original site

Mainly these are the modifications that have been done so far:

- Recipes and Images for them are stored in a S3 (or MinIO) bucket
  - As these files are now external a caching of recipes was added
  - Images are fetched with presigned URLs which are also cached
- No translation for recipes - Only maintain your own language
  - This includes the ingredients
- Removal of legal, donation, etc. stuff
  - This does not mean that you should not [donate](https://nononsense.cooking/donate) 😉
- Removal of the RSS Feed
- SEO and Analytics

## What has been added?

- S3 as data storage for recipes and images
- Recipe Creation and Modification
- Recipe Deletion

## Setup

For deploying the application, the docker image from the [GHCR](https://github.com/mheidinger/nononsensecooking-selfhosted/pkgs/container/nononsensecooking-selfhosted) can be used.
There are a few required environment variables to configure the S3 access (or any other S3 compatible storage):

- AWS_ACCESS_KEY_ID: Access key ID for AWS with necessary permissions
- AWS_SECRET_ACCESS_KEY: Secret access key
- AWS_REGION: Region where the bucket is created in
- S3_BUCKET_NAME: Name of the bucket to be used
- S3_ENDPOINT: Endpoint to connect to, optional if AWS is used
- S3_DOMAIN: Domain of the bucket, required for images to load from the bucket (e.g. `s3.eu-central-1.amazonaws.com`)

Additionally the bucket requires the CORS setup to allow image uploads.
The following is an example CORS configuration for an AWS S3 bucket:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT"],
    "AllowedOrigins": ["<YOUR_DOMAIN_WHERE_NNC_RUNS>"],
    "ExposeHeaders": []
  }
]
```

## Contributing

To run the service locally, first run `pnpm install`.
Then start a local MinIO server for the data and configure it like described above.

Use [the env file](.env.local.example) as template, rename it to `.env.local` and fill with your values.
Finally run `pnpm dev` and head to `http://localhost:3000`!
