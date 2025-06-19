# Securedocs Backend

## Project setup

Aller dans le dossier du projet
```bash
$ cd secure-docs
```

Installer les dépendances
```bash
$ npm install
```

Lancer le consumer
```bash
npx ts-node src/queues/consumer.ts
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
