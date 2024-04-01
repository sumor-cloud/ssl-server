import generateSelfSign from './generateSelfSign.js'
import fse from 'fs-extra'
import spdy from 'spdy'
import closer from './closer.js'

export default async (app, domain, port = 443) => {
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
    await generateSelfSign(domain, 'selfsigned')
  }

  const ssl = {}
  if (await fse.exists(`${sslPath}/domain.key`)) {
    ssl.key = await fse.readFile(`${sslPath}/domain.key`)
  } else {
    ssl.key = await fse.readFile(`${sslPath}/selfsigned.key`)
  }
  if (await fse.exists(`${sslPath}/domain.crt`)) {
    ssl.cert = await fse.readFile(`${sslPath}/domain.crt`)
  } else {
    ssl.cert = await fse.readFile(`${sslPath}/selfsigned.crt`)
  }

  if (await fse.exists(`${sslPath}/ca.crt`)) {
    ssl.cert = ssl.cert + '\n' + await fse.readFile(`${sslPath}/ca.crt`)
  }

  const server = spdy.createServer({
    ...ssl
  }, app)

  server.on('error', (e) => {
    app.logger.error(e)
  })

  // 启动https服务
  return await new Promise((resolve) => {
    server.listen(port, () => {
      resolve(closer(server))
    })
  })
}
