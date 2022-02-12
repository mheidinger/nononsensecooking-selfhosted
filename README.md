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

## What has been added and is planned?

As the goal of this fork is to have a private recipe collection, the functionality to add new recipes has been implemented.
The next step is to also modify existing recipes.

## Setup

For deploying this site, the docker image at `TBD` can be used. As configuration the environment variables of [the env file](.env.local.example) need to be provided.

As S3 storage either the AWS S3 can be used or a [MinIO](https://min.io) instance can be self hosted with the following caveats:
- Recipes (see [examples](examples) for examples) are stored with the prefix `recipes/` and the file ending `.yaml`
- Images with the prefix `images/` and the file ending `.jpg`
- Filenames/IDs of the recipes have to match the corresponding image
  - If you don't have an image for a recipe, a placeholder will be used

## Contributing

To run the service locally, first run `npm install`.
Then start a local MinIO server for the data and configure it like described above.
Test recipes and images can be found in [examples](examples).

Use [the env file](.env.local.example) as template, rename it to `.env.local` and fill with your values.
Finally run `npm start dev` and head to `http://localhost:3000`!
