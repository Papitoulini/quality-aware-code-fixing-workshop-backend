This is a template backend.

## Prerequisites

- node >=16

## Install

```sh
$ npm i
```

## Usage

```sh
$ npm start
```

## Run tests

```sh
$ npm test
```

## Development

```sh
$ npm run dev
```

## Steps

1. Find Differences from pr

- Use Cyclopt Production Database
```sh
$ node scripts/find-diffs-from-pr.js
```

2. Add new snippets

- Use Workshop Database

```sh
$ node scripts/create-workshop-data.js
```

3. Initialize database
```sh
$ node scripts/_init-db.js
```

