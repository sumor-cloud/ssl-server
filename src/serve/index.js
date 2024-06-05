import hostHttps from './hostHttps.js'
import redirectHttp from './redirectHttp.js'
import prepareOptions from './prepareOptions.js'
import getLogger from '../i18n/libraryLogger.js'

export default async (app, options) => {
  options = prepareOptions(options)
  const logger = getLogger()
  const closeHttps = await hostHttps(app, options.domain, options.httpsPort)

  let closeHttp
  if (options.httpPort !== null) {
    try {
      closeHttp = await redirectHttp(options.httpPort, options.httpsPort)
    } catch (e) {
      logger.error(e)
    }
  }

  return async () => {
    await closeHttps()
    if (closeHttp) {
      await closeHttp()
    }
  }
}
