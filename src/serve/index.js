import hostHttps from './hostHttps.js'
import redirectHttp from './redirectHttp.js'

export default async (app, options) => {
  options = options || {}
  const domain = options.domain || 'localhost'
  const httpsPort = options.httpsPort || 443
  const httpPort = options.httpPort || 80
  const closeHttps = await hostHttps(app, domain, httpsPort)

  // const portString = httpsPort === 443 ? '' : `:${httpsPort}`;
  // app.logger.info(`网页服务已启动，访问地址为https://${domain}${portString}`);

  let closeHttp
  try {
    closeHttp = await redirectHttp(httpPort, httpsPort)
  } catch (e) {
    app.logger.error(`http服务无法启动，可能是端口${httpPort}被占用`)
  }

  return async () => {
    await closeHttps()
    if (closeHttp) {
      await closeHttp()
    }
    // app.logger.info(`网页服务已停止运行`);
  }
}
