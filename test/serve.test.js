// port number prefix is 102

import { describe, expect, it, beforeEach, afterEach } from '@jest/globals'

import express from 'express'
import hostHttps from '../src/serve/hostHttps.js'
import redirectHttp from '../src/serve/redirectHttp.js'
import serve from '../src/serve/index.js'
import generateSelfSign from '../src/serve/generateSelfSign.js'
import cleanUpSSL from './utils/cleanUpSSL.js'
import httpCheck from './utils/httpCheck.js'
import prepareOptions from '../src/serve/prepareOptions.js'
describe('Serve', () => {
  beforeEach(async () => {
    await cleanUpSSL()
  })
  afterEach(async () => {
    await cleanUpSSL()
  })
  it('prepareOptions', () => {
    const options = prepareOptions()
    expect(options.domain).toStrictEqual('localhost')
    expect(options.httpsPort).toStrictEqual(443)
    expect(options.httpPort).toStrictEqual(80)
  })
  it('host https', async () => {
    const domain = 'localhost'
    const port = 10211
    const app = express()
    app.get('/', (req, res) => {
      res.send('OK')
    })
    const closeHttps = await hostHttps(app, domain, port)

    const result = await httpCheck(`https://${domain}:${port}`)
    expect(result).toStrictEqual('OK')
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
    const result1 = await httpCheck(`https://${domain}:${port1}`)
    expect(result1).toStrictEqual('OK')

    const closeHttp = await redirectHttp(port2, port1)
    const result2 = await httpCheck(`http://${domain}:${port2}`)
    expect(result2).toStrictEqual('OK')

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
    const result = await httpCheck(`http://${domain}:${port2}`)
    expect(result).toStrictEqual('OK')

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
      httpsPort: port1,
      httpPort: port2
    })
    const result = await httpCheck(`http://${domain}:${port2}`)
    expect(result).toStrictEqual('OK')

    await closeServer()
  })
  it('serve only http', async () => {
    const domain = 'localhost'
    const port = 10252

    await generateSelfSign(domain)

    const app = express()
    app.get('/', (req, res) => {
      res.send('OK')
    })
    const closeServer = await serve(app, {
      httpPort: port
    })
    const result = await httpCheck(`http://${domain}:${port}`)
    expect(result).toStrictEqual('OK')

    await closeServer()
  })
})
