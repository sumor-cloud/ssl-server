import hostHttps from './hostHttps.js'
import hostHttp from './hostHttp.js'
import redirectHttp from './redirectHttp.js'
import prepareOptions from './prepareOptions.js'
import getLogger from '../i18n/libraryLogger.js'

export default async (app, options) => {
  options = prepareOptions(options)
  const logger = getLogger()

  let redirectServerCloser
  let mainServerCloser
  if (options.httpsPort === null && options.httpPort !== null) {
    // http only
    mainServerCloser = await hostHttp(app, options.domain, options.httpPort)
  } else {
    mainServerCloser = await hostHttps(app, options.domain, options.httpsPort)

    if (options.httpPort !== null) {
      try {
        redirectServerCloser = await redirectHttp(options.httpPort, options.httpsPort)
      } catch (e) {
        logger.error(e)
      }
    }
  }

  return async () => {
    await mainServerCloser()
    if (redirectServerCloser) {
      await redirectServerCloser()
    }
  }
}
