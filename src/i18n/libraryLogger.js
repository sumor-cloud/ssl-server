import Logger from '@sumor/logger'

// original code is en
const code = {
  trace: {},
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
    SELF_SIGN_CERT_GENERATED: 'ssl/domain.key未找到，将生成自签名证书'
  }
}
export default () =>
  new Logger({
    scope: 'SERVER',
    code,
    i18n
  })
