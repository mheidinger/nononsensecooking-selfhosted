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

## Dependency upgrade checkpoint — 2026-10-26

Source: [Renovate Dependency Dashboard #108](https://github.com/mheidinger/nononsensecooking-selfhosted/issues/108), cross-checked with the npm registry.

The first batch updates compatible dependency ranges and the lockfile, including
Next.js 16.4.3, React 19.3.1, next-intl 4.14.9, AWS SDK 3, and pnpm 10.34.9.
Docker Actions remain pinned to commit SHAs: Buildx 3.12.0, login 3.7.0, and
build-push 5.4.0. The lint script now invokes ESLint directly because Next.js 16
removed `next lint`.

### Deferred until after deployment testing

| Area | Next upgrade |
| --- | --- |
| Security priority | Sharp 0.34.5 → 0.35.5; production audit reports three high-severity advisories in the current version |
| Runtime and package manager | Node 22 → 24; pnpm 10 → 12 |
| Compiler and linting | TypeScript 5 → 7; ESLint 9 → 10 (ESLint 9 is marked unsupported) |
| Libraries | dotenv 17 → 18; slug 11 → 12; nanoid 5 → 6 |
| Node typings | Keep 24.x for now; latest is 26.x and should be considered with the runtime target |
| CI Actions | checkout 4 → 7; Buildx 3 → 4; login 3 → 4; build-push 5 → 7 |
| Renovate maintenance | Requested config migration; old Dependabot PRs require reconciliation |

### Verification and deployment checks

- Frozen-lockfile installation and production build, including TypeScript checking, passed on Node 22.23.4.
- Browser smoke testing against isolated local S3-compatible storage passed for the homepage, live search, submitted search, English/German pages, and recipe creation, editing, and deletion.
- `pnpm lint` runs but reports two React-hook violations in `src/app/_components/search/SearchBar.tsx`: `react-hooks/use-memo` and `react-hooks/set-state-in-effect`. Search behavior was left unchanged in this dependency-only batch.
- `pnpm audit --prod` reports three high-severity advisories, all in deferred Sharp 0.34.5.
- Docker image builds, registry pushes, and deployment webhooks were not executed. Verify the deployed application against the real S3/MinIO service, especially image upload, image optimization, and signed image URLs, before starting the larger upgrades.
