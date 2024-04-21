// port number prefix is 103

import {
  afterEach,
  beforeEach,
  describe, expect, it
} from '@jest/globals'

import createApp from '../index.js'
import cleanUpSSL from './utils/cleanUpSSL.js'

describe('Expose App', () => {
  beforeEach(async () => {
    await cleanUpSSL()
  })
  afterEach(async () => {
    await cleanUpSSL()
  })
  it('Verify expose type', async () => {
    expect(typeof createApp).toStrictEqual('function')
    const app = createApp()
    expect(typeof app.listen).toStrictEqual('function')
  })
  it('Verify close function', async () => {
    const app = createApp()
    expect(typeof app.close).toStrictEqual('undefined')
    await app.listen(10311)
    expect(typeof app.close).toStrictEqual('function')
    await app.close()
  })
})
