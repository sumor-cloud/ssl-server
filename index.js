import express from 'express'
import serve from './src/serve/index.js'

export default app => {
  app = app || express()
  if (app.disable) {
    app.disable('x-powered-by')
  }

  app.listen = async (port, redirectPort) => {
    app.close = await serve(app, {
      domain: app.domain,
      httpsPort: port,
      httpPort: redirectPort
    })
  }
  return app
}
