import http from 'http'
import closer from './closer.js'
import getLogger from '../i18n/libraryLogger.js'

export default async (app, domain, port) => {
  const logger = getLogger()

  const server = http.createServer(app)

  server.on('error', e => {
    logger.error(e)
  })

  // Start http server
  await new Promise(resolve => {
    server.listen(port, () => {
      resolve()
    })
  })

  const closeServer = closer(server)

  return async () => {
    await closeServer()
  }
}
