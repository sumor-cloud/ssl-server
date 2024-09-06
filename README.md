# ssl-server

A [Sumor Cloud](https://sumor.cloud) Tool.  
[More Documentation](https://sumor.cloud/ssl-server)

SSL Web Server with Express, Support HTTP/2

[![CI](https://github.com/sumor-cloud/ssl-server/actions/workflows/ci.yml/badge.svg)](https://github.com/sumor-cloud/ssl-server/actions/workflows/ci.yml)
[![Test](https://github.com/sumor-cloud/ssl-server/actions/workflows/ut.yml/badge.svg)](https://github.com/sumor-cloud/ssl-server/actions/workflows/ut.yml)
[![Coverage](https://github.com/sumor-cloud/ssl-server/actions/workflows/coverage.yml/badge.svg)](https://github.com/sumor-cloud/ssl-server/actions/workflows/coverage.yml)
[![Audit](https://github.com/sumor-cloud/ssl-server/actions/workflows/audit.yml/badge.svg)](https://github.com/sumor-cloud/ssl-server/actions/workflows/audit.yml)

## Installation

```bash
npm i @sumor/ssl-server --save
```

## Prerequisites

### Node.JS version

Require Node.JS version 18.x or above

### require Node.JS ES module

As this package is written in ES module,
please change the following code in your `package.json` file:

```json
{
  "type": "module"
}
```

## Usage

### Host a simple server

```javascript
import createApp from '@sumor/ssl-server'
const app = createApp()

// listen on port 443 by default if not specified, and redirect 80 to https 443
await app.listen()

console.log('Server running at https://localhost:443/')
```

### Add SSL files

Please add SSL files into root folder `ssl` with the following names:

- `domain.crt`
- `domain.key`
- `ca.crt` (Optional, It will append to the certificate chain)

If not found, the server will generate a self-signed certificate.  
If SSL files changed, it will auto-reload.

## Features

it supports all [express](https://www.npmjs.com/package/express) features, only difference is the `listen` and `close` method. Please refer below example for more details.

### Add middlewares and routes

```javascript
import createApp from '@sumor/ssl-server'
const app = createApp()
import bodyParser from 'body-parser'

// you can add any express middleware
app.use(bodyParser.json())

// add routes
app.get('/', (req, res) => {
  res.send('Hello World!')
})

// listen is async function
await app.listen()
```

### Force close server

```javascript
import createApp from '@sumor/ssl-server'
const app = createApp()

// listen is async function
await app.listen()
// close is async function
await app.close()
```

### Listen on custom port

```javascript
import createApp from '@sumor/ssl-server'
const app = createApp()

// listen is async function
await app.listen(8443, 8080)
console.log(`Server is running on https://localhost:8443/`)
console.log(`Redirect server is running on http://localhost:8080/`)
```

### Listen only http

```javascript
import createApp from '@sumor/ssl-server'
const app = createApp()

// listen is async function
await app.listen(null, 8080)
console.log(`Redirect server is running on http://localhost:8080/`)
```

### Use custom app

By default, ssl server will use latest express long term support version. You can use your own express app by passing it to `createApp` function.

```javascript
import createApp from '@sumor/ssl-server'
import express from 'express'

const expressApp = express()
expressApp.get('/', (req, res) => {
  res.send('Hello World!')
})

const app = createApp(expressApp)

// listen is async function
await app.listen()

console.log('Server running at https://localhost:443/')
```
