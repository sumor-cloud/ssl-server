# ssl-server
SSL Web Server with Express, Support HTTP/2

## Installation
```bash
npm i @sumor/ssl-server --save
```

## Setup

### require Node.JS ES module
As this package is written in ES module,
please change the following code in your ```package.json``` file:
```json
{
    "type": "module"
}
```

## Usage

### host a simple server

```javascript
const createApp = require('@sumor/ssl-server');
const app = createApp();

// listen on port 443 by default, and redirect 80 to https 443
await app.listen();
```


### add SSL files
Please add SSL files into root folder ```ssl``` with the following names:
- ```domain.crt```
- ```domain.key```
- ```ca.crt```

If not found, the server will generate a self-signed certificate.

## Features

### support all express features

### add middlewares and routes

```javascript
const createApp = require('@sumor/ssl-server');
const app = createApp();
const bodyParser = require('body-parser');

// you can add any express middleware
app.use(bodyParser);

// add routes
app.get('/', (req, res) => {
    res.send('Hello World!');
});

await app.listen();
```

### force close server

```javascript
const createApp = require('@sumor/ssl-server');
const app = createApp();

await app.listen();
await app.close();
```