import {
  describe, expect, it
} from '@jest/globals'

import App from '../index.js'

describe('Expose App', () => {
  it('Verify expose type', async () => {
    expect(typeof App).toStrictEqual('function')
    const app = new App()
    expect(typeof app).toStrictEqual('object')
  })
})
