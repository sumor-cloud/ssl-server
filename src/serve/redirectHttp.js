// redirect http to https

import http from 'http'
import checkPort from '../utils/checkPort.js'
import closer from './closer.js'

export default async (port, port2) => {
  const isPortAvailable = await checkPort(port)
  if (!isPortAvailable) {
    throw new Error(`Port ${port} is not available`)
  }
  const server = http.createServer((req, res) => {
    const domain = req.headers.host.split(':')[0]
    const httpsPort = port2 === 443 ? '' : `:${port2}`
    res.writeHead(301, {
      Location: `https://${domain}${httpsPort}${req.url}`
    })
    res.end()
  })
  return await new Promise((resolve) => {
    server.listen(port, () => {
      resolve(closer(server))
    })
  })
}
