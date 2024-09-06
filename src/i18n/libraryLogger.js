import Logger from '@sumor/logger'

// original code is en
const code = {
  trace: {
    HTTPS_SERVER_STARTED: 'https server started',
    HTTP_REDIRECT_SERVER_STARTED: 'http redirect server started',
    HTTP_SERVER_STARTED: 'http server started'
  },
  debug: {},
  info: {
    SELF_SIGN_CERT_GENERATED: 'ssl/domain.key not found, will generate self-signed certificate'
  },
  warn: {},
  error: {}
}

// languages: zh, es, ar, fr, ru, de, pt, ja, ko
const i18n = {
  zh: {
    HTTPS_SERVER_STARTED: 'https服务器启动',
    HTTP_REDIRECT_SERVER_STARTED: 'http重定向服务器启动',
    HTTP_SERVER_STARTED: 'http服务器启动',
    SELF_SIGN_CERT_GENERATED: 'ssl/domain.key未找到，将生成自签名证书'
  }
}
export default () =>
  new Logger({
    scope: 'SERVER',
    code,
    i18n
  })
