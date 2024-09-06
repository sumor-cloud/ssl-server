import hostHttps from './hostHttps.js'
import hostHttp from './hostHttp.js'
import redirectHttp from './redirectHttp.js'
import getLogger from '../i18n/libraryLogger.js'

export default async (app, options) => {
  options = options || {}
  options.domain = options.domain || 'localhost'

  if (!options.httpsPort) {
    options.httpsPort = null
  }
  if (!options.httpPort) {
    options.httpPort = null
  }

  const logger = getLogger()

  let redirectServerCloser
  let mainServerCloser
  if (options.httpsPort === null && options.httpPort !== null) {
    // http only
    mainServerCloser = await hostHttp(app, options.domain, options.httpPort)
    logger.code('HTTP_SERVER_STARTED')
  } else {
    options.httpsPort = options.httpsPort || 443
    if (options.httpsPort === 443 && options.httpPort === null) {
      options.httpPort = 80
    }
    mainServerCloser = await hostHttps(app, options.domain, options.httpsPort)
    logger.code('HTTPS_SERVER_STARTED')

    if (options.httpPort !== null) {
      try {
        redirectServerCloser = await redirectHttp(options.httpPort, options.httpsPort)
        logger.code('HTTP_REDIRECT_SERVER_STARTED')
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
