// port number prefix is 102

import {
  describe, expect, it, beforeEach, afterEach
} from '@jest/globals'

import axios from 'axios'
import https from 'https'
import express from 'express'
import hostHttps from '../src/serve/hostHttps.js'
import redirectHttp from '../src/serve/redirectHttp.js'
import serve from '../src/serve/index.js'
import generateSelfSign from '../src/serve/generateSelfSign.js'
import cleanUpSSL from './utils/cleanUpSSL.js'

describe('Serve', () => {
  beforeEach(async () => {
    await cleanUpSSL()
  })
  afterEach(async () => {
    await cleanUpSSL()
  })
  it('host https', async () => {
    const domain = 'localhost'
    const port = 10211
    const app = express()
    app.get('/', (req, res) => {
      res.send('OK')
    })
    const closeHttps = await hostHttps(app, domain, port)

    const result = await axios.get(`https://${domain}:${port}`, {
      httpsAgent: new https.Agent({
        rejectUnauthorized: false
      })
    })
    expect(result.data).toStrictEqual('OK')
    await closeHttps()
  })
  it('redirect http to https', async () => {
    const domain = 'localhost'
    const port1 = 10221
    const port2 = 10222

    const app = express()
    app.get('/', (req, res) => {
      res.send('OK')
    })
    const closeHttps = await hostHttps(app, domain, port1)
    const result1 = await axios.get(`https://${domain}:${port1}`, {
      httpsAgent: new https.Agent({
        rejectUnauthorized: false
      })
    })
    expect(result1.data).toStrictEqual('OK')

    const closeHttp = await redirectHttp(port2, port1)
    const result2 = await axios.get(`http://${domain}:${port2}`, {
      httpsAgent: new https.Agent({
        rejectUnauthorized: false
      })
    })
    expect(result2.data).toStrictEqual('OK')

    await closeHttps()
    await closeHttp()
  })
  it('serve without http', async () => {
    const domain = 'localhost'
    const port1 = 10231
    const port2 = 10232

    await generateSelfSign(domain)

    const closeHttp = await redirectHttp(port2, port1)

    const app = express()
    app.get('/', (req, res) => {
      res.send('OK')
    })
    const closeServer = await serve(app, {
      domain,
      httpsPort: port1,
      httpPort: port2
    })
    const result = await axios.get(`http://${domain}:${port2}`, {
      httpsAgent: new https.Agent({
        rejectUnauthorized: false
      })
    })
    expect(result.data).toStrictEqual('OK')

    await closeServer()
    await closeHttp()
  })
  it('serve with http', async () => {
    const domain = 'localhost'
    const port1 = 10241
    const port2 = 10242

    await generateSelfSign(domain)

    const app = express()
    app.get('/', (req, res) => {
      res.send('OK')
    })
    const closeServer = await serve(app, {
      port: port1,
      redirectPort: port2
    })
    const result = await axios.get(`http://${domain}:${port2}`, {
      httpsAgent: new https.Agent({
        rejectUnauthorized: false
      })
    })
    expect(result.data).toStrictEqual('OK')
    await closeServer()
  })
})
