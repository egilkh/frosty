# Frosty

## Description

A highly opinionated mock server. Tries to imitate a REST like server. Useful for working with design/frontend without having to have servers running.

Built using [NestJS](https://nestjs.com/) and [Level](https://github.com/Level/level).

### URLS

A request where the last segment ends in integer or UUID is considered a single Entity. All other requests are considered a Collection.

### Create a Entity

POST to /collection/ with your payload. An id will be assigned to payload.id and your payload will be saved.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## License

Frosty is [MIT licensed](LICENSE).
