import generateSelfSign from './generateSelfSign.js'
import fse from 'fs-extra'
import https from 'https'
import closer from './closer.js'
import loadCertificates from '../utils/loadCertificates.js'
import tls from 'tls'

export default async (app, domain, port) => {
  if (!app.logger) {
    const types = ['trace', 'debug', 'info', 'warn', 'error', 'fatal']
    app.logger = {}
    for (let i = 0; i < types.length; i += 1) {
      const type = types[i]
      app.logger[type] = console[type] || console.log
    }
  }

  const sslPath = `${process.cwd()}/ssl`
  if (!await fse.exists(`${sslPath}/domain.key`)) {
    app.logger.info('ssl/domain.key not found, will generate self-signed certificate')
    await generateSelfSign(domain, 'selfsigned')
  }

  let secureContext
  const sslLoaderClose = await loadCertificates((certs) => {
    secureContext = tls.createSecureContext(certs)
  })

  const server = https.createServer({
    SNICallback: (hostname, callback) => {
      callback(null, secureContext)
    }
  }, app)

  server.on('error', (e) => {
    app.logger.error(e)
  })

  // 启动https服务
  await new Promise((resolve) => {
    server.listen(port, () => {
      resolve()
    })
  })

  const closeServer = closer(server)

  return async () => {
    await sslLoaderClose()
    await closeServer()
  }
}
