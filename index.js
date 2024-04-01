import express from 'express'
import serve from './src/serve/index.js'

export default (app) => {
  app = app || express()
  app.listen = async (port) => {
    app.close = await serve(app, {
      domain: app.domain,
      httpsPort: port
    })
  }
  return app
}
