import hostHttps from './hostHttps.js'
import redirectHttp from './redirectHttp.js'

export default async (app, options) => {
  options = options || {}
  const domain = options.domain || 'localhost'
  const httpsPort = options.httpsPort || 443
  const httpPort = options.httpPort || 80
  const closeHttps = await hostHttps(app, domain, httpsPort)

  let closeHttp
  try {
    closeHttp = await redirectHttp(httpPort, httpsPort)
  } catch (e) {
    app.logger.error(`http redirect server failed to start, maybe port ${httpPort} is already in use`)
  }

  return async () => {
    await closeHttps()
    if (closeHttp) {
      await closeHttp()
    }
  }
}
