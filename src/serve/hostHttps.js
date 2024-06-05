import generateSelfSign from './generateSelfSign.js'
import fse from 'fs-extra'
import https from 'https'
import closer from './closer.js'
import loadCertificates from '../utils/loadCertificates.js'
import tls from 'tls'
import getLogger from '../i18n/libraryLogger.js'

export default async (app, domain, port) => {
  const logger = getLogger()
  const sslPath = `${process.cwd()}/ssl`
  if (!(await fse.exists(`${sslPath}/domain.key`))) {
    logger.code('SELF_SIGN_CERT_GENERATED')
    await generateSelfSign(domain, 'selfsigned')
  }

  let secureContext
  const sslLoaderClose = await loadCertificates(certs => {
    secureContext = tls.createSecureContext(certs)
  })

  const server = https.createServer(
    {
      SNICallback: (hostname, callback) => {
        callback(null, secureContext)
      }
    },
    app
  )

  server.on('error', e => {
    logger.error(e)
  })

  // 启动https服务
  await new Promise(resolve => {
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
