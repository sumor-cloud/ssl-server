import express from 'express'
import serve from './src/serve'

export default (app) => {
  app = app || express()
  app.listen = async (port) => {
    app.close = await serve(app, {
      httpsPort: port
    })
  }
  return app
}
