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

Use Node.js 24 (the exact version is pinned in `.nvmrc`) and run `corepack enable` to use the pnpm version pinned in `package.json`.

To run the service locally, first run `pnpm install`.
Then start a local MinIO server for the data and configure it like described above.

Use [the env file](.env.local.example) as template, rename it to `.env.local` and fill with your values.
Finally run `pnpm dev` and head to `http://localhost:3000`!

### TypeScript

- `pnpm typecheck` generates Next.js route types and checks the project with TypeScript 7's native `tsc`.
- `pnpm build` runs that check before the production build. Type errors stop the build; Next.js's own additional type check remains enabled.
- `pnpm lint` runs ESLint, including its type-aware rules.

The compiler is installed as `@typescript/native` (an npm alias for `typescript@^7`).
The `typescript` dependency aliases `@typescript/typescript6` to provide the legacy compiler API required by ESLint and Prettier's import organizer.
Next.js's additional type check also resolves this TS 6 package; the explicit build prerequisite ensures application code passes TS 7.
This follows Microsoft's [side-by-side installation guidance](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/#running-side-by-side-with-typescript-6.0).

For VS Code, install the [TypeScript native extension](https://marketplace.visualstudio.com/items?itemName=TypeScriptTeam.native-preview).
Workspace settings enable it instead of pointing the old language service at `typescript/lib`.
The native language service does not support legacy plugins, so CSS-module-specific completion from `typescript-plugin-css-modules` is no longer configured.
