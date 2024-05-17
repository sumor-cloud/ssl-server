import hostHttps from './hostHttps.js'
import redirectHttp from './redirectHttp.js'
import prepareOptions from './prepareOptions.js'

export default async (app, options) => {
  options = prepareOptions(options)
  const closeHttps = await hostHttps(app, options.domain, options.httpsPort)

  let closeHttp
  if (options.httpPort !== null) {
    try {
      closeHttp = await redirectHttp(options.httpPort, options.httpsPort)
    } catch (e) {
      app.logger.error(
        `http redirect server failed to start, maybe port ${options.httpPort} is already in use`
      )
    }
  }

  return async () => {
    await closeHttps()
    if (closeHttp) {
      await closeHttp()
    }
  }
}
