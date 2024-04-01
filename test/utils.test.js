// port number prefix is 101

import {
  describe, expect, it
} from '@jest/globals'

import http from 'http'
import checkPort from '../src/utils/checkPort.js'
import loadCertificates from '../src/utils/loadCertificates.js'
import fse from 'fs-extra'
import cleanUpSSL from './utils/cleanUpSSL.js'
import delay from '../src/utils/delay.js'

describe('Utils', () => {
  it('check port is available', async () => {
    const port = 10111
    const result = await checkPort(port)
    expect(result).toStrictEqual(true)
  })
  it('check port is not available', async () => {
    const port = 10112
    // create server to occupy port
    const server = http.createServer((req, res) => {
      res.end('Hello World')
    })
    server.listen(port)
    const result = await checkPort(port)
    server.close()
    expect(result).toStrictEqual(false)
  })
  it('load certificate', async () => {
    const sslPath = `${process.cwd()}/ssl`
    await fse.ensureDir(sslPath)
    await fse.writeFile(`${sslPath}/domain.key`, 'key')
    await fse.writeFile(`${sslPath}/domain.crt`, 'crt')
    await fse.writeFile(`${sslPath}/ca.crt`, 'ca')
    await fse.writeFile(`${sslPath}/selfsigned.key`, 'selfsigned.key')
    await fse.writeFile(`${sslPath}/selfsigned.crt`, 'selfsigned.crt')
    let result = {}
    const close = await loadCertificates((certs) => {
      result = certs
    })
    expect(result.key).toStrictEqual('key')
    expect(result.cert).toStrictEqual('crt\nca')

    await fse.writeFile(`${sslPath}/domain.key`, 'key2')
    await fse.writeFile(`${sslPath}/domain.crt`, 'crt2')
    await fse.writeFile(`${sslPath}/ca.crt`, 'ca2')

    await delay(300)
    expect(result.key).toStrictEqual('key2')
    expect(result.cert).toStrictEqual('crt2\nca2')

    await cleanUpSSL()

    await close()
  })
})
