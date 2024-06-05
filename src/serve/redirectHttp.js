// redirect http to https

import http from 'http'
import checkPort from '../utils/checkPort.js'
import closer from './closer.js'
import LibraryError from '../i18n/LibraryError.js'

export default async (httpPort, httpsPort) => {
  const isPortAvailable = await checkPort(httpPort)
  if (!isPortAvailable) {
    throw new LibraryError('REDIRECT_PORT_NOT_AVAILABLE', { port: httpPort })
  }
  const server = http.createServer((req, res) => {
    try {
      const domain = req.headers.host.split(':')[0]
      const httpsPortString = httpsPort === 443 ? '' : `:${httpsPort}`
      res.writeHead(301, {
        Location: `https://${domain}${httpsPortString}${req.url}`
      })
      res.end()
    } catch (e) {
      res.end('Redirect Error')
    }
  })
  return await new Promise(resolve => {
    server.listen(httpPort, () => {
      resolve(closer(server))
    })
  })
}
