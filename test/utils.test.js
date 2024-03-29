import {
  describe, expect, it
} from '@jest/globals'

import http from 'http'
import checkPort from '../src/utils/checkPort.js'

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
})
